import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings } from '../controllers/bookingController';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/', authorizeAdmin, getAllBookings);

export default router;
