import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('WARNING: STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-01-27.acacia' as any, // Using latest or specific version
});

/**
 * Creates a Payment Intent for a booking
 * @param amount Amount in cents
 * @param bookingId The ID of the booking
 * @param customerEmail Customer's email
 */
export const createPaymentIntent = async (amount: number, bookingId: string, customerEmail: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency: 'usd',
            metadata: {
                bookingId,
            },
            receipt_email: customerEmail,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent;
    } catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        throw error;
    }
};

export const stripeInstance = stripe;
