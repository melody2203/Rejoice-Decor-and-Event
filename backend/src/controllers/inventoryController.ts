import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getInventoryItems = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.query;

        const items = await prisma.inventoryItem.findMany({
            where: categoryId ? { categoryId: categoryId as string } : {},
            include: {
                category: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
};

export const getInventoryItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await prisma.inventoryItem.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item details' });
    }
};

export const createInventoryItem = async (req: Request, res: Response) => {
    try {
        const { name, description, totalStock, pricePerDay, categoryId, imageUrl } = req.body;

        const item = await prisma.inventoryItem.create({
            data: {
                name,
                description,
                totalStock: parseInt(totalStock),
                pricePerDay: parseFloat(pricePerDay),
                categoryId,
                imageUrl
            }
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
};
