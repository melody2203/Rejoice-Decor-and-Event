import { Router } from 'express';
import { getCategories, getProjects, createProject } from '../controllers/portfolioController';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/categories', getCategories);
router.get('/projects', getProjects);
router.post('/projects', authenticateJWT, authorizeAdmin, createProject);

export default router;
