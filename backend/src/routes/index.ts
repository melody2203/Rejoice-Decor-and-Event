import { Router } from 'express';
import authRoutes from './authRoutes';
import portfolioRoutes from './portfolioRoutes';
import inventoryRoutes from './inventoryRoutes';
import bookingRoutes from './bookingRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
