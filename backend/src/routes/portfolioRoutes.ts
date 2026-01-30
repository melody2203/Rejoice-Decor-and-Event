import { Router } from 'express';
import {
    getCategories,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/portfolioController';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/projects', getProjects);

// Admin routes
router.post('/projects', authenticateJWT, authorizeAdmin, createProject);
router.put('/projects/:id', authenticateJWT, authorizeAdmin, updateProject);
router.delete('/projects/:id', authenticateJWT, authorizeAdmin, deleteProject);

router.post('/categories', authenticateJWT, authorizeAdmin, createCategory);
router.put('/categories/:id', authenticateJWT, authorizeAdmin, updateCategory);
router.delete('/categories/:id', authenticateJWT, authorizeAdmin, deleteCategory);

export default router;
