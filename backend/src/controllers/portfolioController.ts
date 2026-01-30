import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.eventCategory.findMany({
            include: {
                _count: {
                    select: { pastWorks: true, items: true }
                }
            }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const { categorySlug } = req.query;

        const projects = await prisma.pastWork.findMany({
            where: categorySlug ? {
                category: {
                    slug: categorySlug as string
                }
            } : {},
            include: {
                category: true
            },
            orderBy: {
                eventDate: 'desc'
            }
        });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const { title, description, categoryId, imageUrls, eventDate } = req.body;

        const project = await prisma.pastWork.create({
            data: {
                title,
                description,
                categoryId,
                imageUrls,
                eventDate: new Date(eventDate)
            }
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, categoryId, imageUrls, eventDate } = req.body;

        const project = await prisma.pastWork.update({
            where: { id },
            data: {
                title,
                description,
                categoryId,
                imageUrls,
                eventDate: eventDate ? new Date(eventDate) : undefined
            }
        });

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.pastWork.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, imageUrl } = req.body;
        const category = await prisma.eventCategory.create({
            data: { name, slug, description, imageUrl }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, description, imageUrl } = req.body;
        const category = await prisma.eventCategory.update({
            where: { id },
            data: { name, slug, description, imageUrl }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.eventCategory.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
