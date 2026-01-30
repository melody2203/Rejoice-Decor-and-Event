import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeAdmin);

router.get('/stats', getDashboardStats);

export default router;
