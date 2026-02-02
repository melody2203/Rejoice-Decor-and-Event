"use client";

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '@/components/ui/Button';

interface PaymentFormProps {
    bookingId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}

export default function PaymentForm({ bookingId, onSuccess, onError }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL can be a generic success page or back to bookings
                return_url: `${window.location.origin}/bookings?success=true&bookingId=${bookingId}`,
            },
            redirect: 'if_required', // Handle success immediately if no redirect is needed
        });

        if (error) {
            onError(error.message || 'An unexpected error occurred.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess();
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button
                type="submit"
                variant="gold"
                className="w-full py-4 rounded-3xl"
                disabled={!stripe || isLoading}
                loading={isLoading}
            >
                PROCESS SECURE PAYMENT
            </Button>
        </form>
    );
}
