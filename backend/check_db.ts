
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const itemCount = await prisma.inventoryItem.count();
        const catCount = await prisma.rentalCategory.count();
        const projectCount = await prisma.project.count();

        console.log(`Inventory Items: ${itemCount}`);
        console.log(`Rental Categories: ${catCount}`);
        console.log(`Projects: ${projectCount}`);

        if (itemCount > 0) {
            const firstItem = await prisma.inventoryItem.findFirst();
            console.log('First Item:', firstItem);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
