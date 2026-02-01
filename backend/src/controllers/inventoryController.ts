import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getInventoryItems = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.categoryId as string | undefined;

        const items = await prisma.inventoryItem.findMany({
            where: categoryId ? { categoryId } : {},
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
            where: { id: id as string },
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
        const { name, description, totalStock, pricePerDay, pricePerWeekend, durationNotes, categoryId, imageUrl } = req.body;

        const item = await prisma.inventoryItem.create({
            data: {
                name,
                description,
                totalStock: parseInt(totalStock),
                pricePerDay: parseFloat(pricePerDay),
                pricePerWeekend: pricePerWeekend ? parseFloat(pricePerWeekend) : undefined,
                durationNotes,
                categoryId,
                imageUrl
            }
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
};

export const updateInventoryItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, totalStock, pricePerDay, pricePerWeekend, durationNotes, categoryId, imageUrl } = req.body;

        const item = await prisma.inventoryItem.update({
            where: { id: id as string },
            data: {
                name,
                description,
                totalStock: totalStock ? parseInt(totalStock) : undefined,
                pricePerDay: pricePerDay ? parseFloat(pricePerDay) : undefined,
                pricePerWeekend: pricePerWeekend ? parseFloat(pricePerWeekend) : undefined,
                durationNotes,
                categoryId,
                imageUrl
            }
        });

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.inventoryItem.delete({
            where: { id: id as string }
        });
        res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
};

export const getRentalCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.rentalCategory.findMany({
            include: {
                _count: {
                    select: { items: true }
                }
            },
            orderBy: {
                order: 'asc'
            }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rental categories' });
    }
};
