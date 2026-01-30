import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Total Revenue (from all successfully processed payments)
        const totalRevenueResult = await prisma.payment.aggregate({
            _sum: {
                amount: true
            }
        });
        const totalRevenue = totalRevenueResult._sum.amount || 0;

        // 2. Booking Status Distribution
        const bookingStats = await prisma.booking.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });

        // 3. Top 5 Most Rented Items
        const topItems = await prisma.bookingItem.groupBy({
            by: ['itemId'],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        // Enrich top items with names
        const enrichedTopItems = await Promise.all(
            topItems.map(async (item) => {
                const details = await prisma.inventoryItem.findUnique({
                    where: { id: item.itemId },
                    select: { name: true }
                });
                return {
                    name: details?.name || 'Unknown',
                    count: item._sum.quantity
                };
            })
        );

        // 4. Monthly Revenue (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentPayments = await prisma.payment.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                amount: true,
                createdAt: true
            }
        });

        // Group payments by month
        const monthlyRevenueMap: Record<string, number> = {};
        recentPayments.forEach(payment => {
            const date = new Date(payment.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            monthlyRevenueMap[monthYear] = (monthlyRevenueMap[monthYear] || 0) + parseFloat(payment.amount.toString());
        });

        const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, total]) => ({
            month,
            total
        })).sort((a, b) => {
            const dateA = new Date(a.month + ' 01');
            const dateB = new Date(b.month + ' 01');
            return dateA.getTime() - dateB.getTime();
        });

        res.json({
            totalRevenue,
            bookingStats,
            topItems: enrichedTopItems,
            monthlyRevenue
        });
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
