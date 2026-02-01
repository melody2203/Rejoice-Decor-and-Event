import { Router } from 'express';
import { getInventoryItems, getInventoryItemById, createInventoryItem, updateInventoryItem, deleteInventoryItem, getRentalCategories } from '../controllers/inventoryController';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getInventoryItems);
router.get('/categories', getRentalCategories);
router.get('/:id', getInventoryItemById);

// Admin only routes
router.use(authenticateJWT, authorizeAdmin);
router.post('/', createInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
