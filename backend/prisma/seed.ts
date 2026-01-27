import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const categories = [
        { name: 'Wedding', slug: 'wedding', description: 'Elegant and luxurious wedding flower and decor' },
        { name: 'Birthday', slug: 'birthday', description: 'Fun and vibrant decorations for all ages' },
        { name: 'Graduation', slug: 'graduation', description: 'Celebrating academic success with style' },
        { name: 'Engagement', slug: 'engagement', description: 'Romantic setups for your special proposal' },
        { name: 'Corporate', slug: 'corporate', description: 'Professional and branded event styling' },
    ];

    for (const cat of categories) {
        const category = await prisma.eventCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
            },
        });
        console.log(`Created/Updated category: ${category.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
