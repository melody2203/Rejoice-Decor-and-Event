import { Router } from 'express';
import { getInventoryItems, getInventoryItemById, createInventoryItem } from '../controllers/inventoryController';
import { authenticateJWT, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getInventoryItems);
router.get('/:id', getInventoryItemById);
router.post('/', authenticateJWT, authorizeAdmin, createInventoryItem);

export default router;
