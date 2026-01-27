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
