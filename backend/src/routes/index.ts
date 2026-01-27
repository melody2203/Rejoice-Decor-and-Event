import { Router } from 'express';
import authRoutes from './authRoutes';
import portfolioRoutes from './portfolioRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
