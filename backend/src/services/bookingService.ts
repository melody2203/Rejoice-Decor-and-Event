import prisma from '../prisma/client';

/**
 * Checks if the requested quantity of an item is available for the given date range.
 * @param itemId The ID of the inventory item
 * @param quantity The requested quantity
 * @param startDate The event start date
 * @param endDate The event end date
 * @returns Object containing available status and current stock info
 */
export const checkItemAvailability = async (
    itemId: string,
    requestedQuantity: number,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
) => {
    // 1. Get total stock for the item
    const item = await prisma.inventoryItem.findUnique({
        where: { id: itemId }
    });

    if (!item) {
        throw new Error(`Item ${itemId} not found`);
    }

    // 2. Find all overlapping bookings that are not CANCELLED
    // Overlap condition: (StartDate1 <= EndDate2) AND (EndDate1 >= StartDate2)
    const overlappingBookings = await prisma.bookingItem.findMany({
        where: {
            itemId,
            booking: {
                status: {
                    not: 'CANCELLED'
                },
                AND: [
                    { startDate: { lte: endDate } },
                    { endDate: { gte: startDate } }
                ],
                NOT: excludeBookingId ? { id: excludeBookingId } : undefined
            }
        },
        select: {
            quantity: true
        }
    });

    // 3. Sum up the quantities already reserved
    const reservedQuantity = overlappingBookings.reduce((sum, item) => sum + item.quantity, 0);
    const availableStock = item.totalStock - reservedQuantity;

    return {
        isAvailable: availableStock >= requestedQuantity,
        availableStock,
        totalStock: item.totalStock,
        reservedQuantity
    };
};
