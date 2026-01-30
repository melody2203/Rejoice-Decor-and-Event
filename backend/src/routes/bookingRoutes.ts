import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings, createPaymentIntent, handleStripeWebhook, updateBookingStatus } from '../controllers/bookingController';
import express from 'express';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

// Webhook needs raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.use(authenticateJWT);
// ... existing routes

router.post('/', createBooking);
router.post('/create-intent', createPaymentIntent);
router.get('/my-bookings', getMyBookings);
router.get('/', authorizeAdmin, getAllBookings);
router.patch('/:id/status', authorizeAdmin, updateBookingStatus);

export default router;
