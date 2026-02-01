import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { checkItemAvailability } from '../services/bookingService';
import { createPaymentIntent as stripeCreateIntent, stripeInstance } from '../services/stripeService';

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!sig || !webhookSecret) {
            throw new Error('Missing stripe signature or webhook secret');
        }
        event = stripeInstance.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as any;
        const bookingId = paymentIntent.metadata.bookingId;

        try {
            await prisma.$transaction([
                // 1. Update booking status
                prisma.booking.update({
                    where: { id: bookingId },
                    data: { status: 'CONFIRMED' }
                }),
                // 2. Create payment record
                prisma.payment.create({
                    data: {
                        bookingId,
                        amount: paymentIntent.amount / 100,
                        status: 'FULL',
                        stripePaymentId: paymentIntent.id
                    }
                })
            ]);
            console.log(`Booking ${bookingId} confirmed via Stripe.`);
        } catch (error) {
            console.error('Error updating booking after payment:', error);
            return res.status(500).json({ error: 'Failed to update booking' });
        }
    }

    res.json({ received: true });
};

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;
        const user = (req as any).user;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.userId !== user.userId && user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const paymentIntent = await stripeCreateIntent(
            parseFloat(booking.totalAmount.toString()),
            booking.id,
            booking.user.email
        );

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create payment intent' });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, items, eventType, location, decorPackage, customRequest } = req.body;
        const userId = (req as any).user.userId;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Missing booking dates' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start < new Date()) {
            return res.status(400).json({ error: 'Start date cannot be in the past' });
        }

        if (end < start) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        // 1. Check availability for all items if any
        if (items && items.length) {
            for (const item of items) {
                const availability = await checkItemAvailability(
                    item.itemId,
                    item.quantity,
                    start,
                    end
                );

                if (!availability.isAvailable) {
                    return res.status(400).json({
                        error: `Insufficient stock for item ${item.itemId}. Available: ${availability.availableStock}`
                    });
                }
            }
        }

        // 2. Calculate total amount
        let totalAmount = 0;
        const bookingItemsData = [];

        if (items && items.length) {
            for (const item of items) {
                const inventoryItem = await prisma.inventoryItem.findUnique({
                    where: { id: item.itemId }
                });

                if (!inventoryItem) continue;

                const itemPrice = parseFloat(inventoryItem.pricePerDay.toString());
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

                totalAmount += itemPrice * item.quantity * diffDays;

                bookingItemsData.push({
                    itemId: item.itemId,
                    quantity: item.quantity
                });
            }
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                startDate: start,
                endDate: end,
                totalAmount,
                status: 'PENDING',
                eventType,
                location,
                decorPackage,
                customRequest,
                items: {
                    create: bookingItemsData
                }
            },
            include: {
                items: {
                    include: {
                        item: true
                    }
                }
            }
        });

        res.status(201).json(booking);
    } catch (error: any) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: error.message || 'Failed to create booking' });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                payments: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: {
                    select: { email: true, profile: true }
                },
                items: {
                    include: {
                        item: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all bookings' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bookingId = id as string;
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status },
            include: {
                user: {
                    select: { email: true }
                }
            }
        });

        res.json(booking);
    } catch (error) {
        console.error('Failed to update booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
};

export const confirmManualPayment = async (req: Request, res: Response) => {
    try {
        const { bookingId, paymentMethod, referenceNumber, amount } = req.body;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const result = await prisma.$transaction([
            prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CONFIRMED' }
            }),
            prisma.payment.create({
                data: {
                    bookingId,
                    amount: amount || booking.totalAmount,
                    status: 'FULL',
                    paymentMethod,
                    referenceNumber
                }
            })
        ]);

        res.json({ message: 'Payment confirmed successfully', booking: result[0] });
    } catch (error) {
        console.error('Manual payment confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
};
