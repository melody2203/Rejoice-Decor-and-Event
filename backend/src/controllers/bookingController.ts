import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, items } = req.body;
        const userId = (req as any).user.userId;

        if (!startDate || !endDate || !items || !items.length) {
            return res.status(400).json({ error: 'Missing booking details' });
        }

        // Calculate total amount (Simplified for MVP)
        let totalAmount = 0;
        const bookingItemsData = [];

        for (const item of items) {
            const inventoryItem = await prisma.inventoryItem.findUnique({
                where: { id: item.itemId }
            });

            if (!inventoryItem) {
                return res.status(404).json({ error: `Item ${item.itemId} not found` });
            }

            const itemPrice = parseFloat(inventoryItem.pricePerDay.toString());
            totalAmount += itemPrice * item.quantity;

            bookingItemsData.push({
                itemId: item.itemId,
                quantity: item.quantity
            });
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalAmount,
                status: 'PENDING',
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
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
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
