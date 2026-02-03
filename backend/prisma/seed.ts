import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

// Use Vercel URL for production/absolute paths as requested
const BASE_IMAGE_URL = 'https://rejoice-decor-and-event.vercel.app';

async function main() {
    console.log('Start seeding...');

    // Cleanup existing inventory and past works to avoid duplicates on re-seed
    await prisma.bookingItem.deleteMany({});
    await prisma.inventoryItem.deleteMany({});
    await prisma.pastWork.deleteMany({});
    console.log('Cleanup finished.');

    // Admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rejoice.com' },
        update: {},
        create: {
            email: 'admin@rejoice.com',
            password: adminPassword,
            role: 'ADMIN',
            profile: {
                create: {
                    phone: '1234567890',
                    address: 'Rejoice HQ'
                }
            }
        },
    });
    console.log('Admin user created/updated:', admin.email);

    // Event Categories
    const eventCategories = [
        { name: 'Wedding', slug: 'wedding', description: 'Elegant and luxurious wedding flower and decor', order: 1 },
        { name: 'Birthday', slug: 'birthday', description: 'Fun and vibrant decorations for all ages', order: 2 },
        { name: 'Graduation', slug: 'graduation', description: 'Celebrating academic success with style', order: 3 },
        { name: 'Engagement', slug: 'engagement', description: 'Romantic setups for your special proposal', order: 4 },
        { name: 'Corporate', slug: 'corporate', description: 'Professional and branded event decor for businesses', order: 5 },
        { name: 'Others', slug: 'others', description: 'Other special events and custom decor', order: 6 },
    ];

    for (const cat of eventCategories) {
        await prisma.eventCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description, order: cat.order },
            create: { ...cat },
        });
        console.log(`Created/Updated Event Category: ${cat.name}`);
    }

    // Rental Categories
    const rentalCategories = [
        { name: 'Chairs', slug: 'chairs', description: 'Premium seating for your guests', order: 1 },
        { name: 'Curtains', slug: 'curtains', description: 'Elegant drapery and backdrops', order: 2 },
        { name: 'Floral Tools', slug: 'floral-tools', description: 'Everything for floral arrangements', order: 3 },
        { name: 'Mats & Rugs', slug: 'mats-rugs', description: 'Traditional and modern floor decor', order: 4 },
        { name: 'Lighting', slug: 'lighting', description: 'Ambient and decorative lighting solutions', order: 5 },
        { name: 'Cultural', slug: 'cultural', description: 'Traditional and authentic cultural decor pieces', order: 6 },
        { name: 'Others', slug: 'others-rental', description: 'Miscellaneous decor items', order: 7 },
    ];

    for (const cat of rentalCategories) {
        await prisma.rentalCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description, order: cat.order },
            create: { ...cat },
        });
        console.log(`Created/Updated Rental Category: ${cat.name}`);
    }

    const inventoryItems = [
        // Chairs
        {
            name: 'Double Gold Throne',
            description: 'Grand double throne for the bride and groom, finished in royal gold.',
            totalStock: 2,
            pricePerDay: 7500.00,
            pricePerWeekend: 12500.00,
            durationNotes: 'Weekend special available',
            categorySlug: 'chairs',
            imageUrl: '/images/rentals/chairs/gold_throne_double.jpg'
        },
        {
            name: 'Simple Gold Chair',
            description: 'Minimalist elegant gold chair for modern events.',
            totalStock: 200,
            pricePerDay: 325.00,
            pricePerWeekend: 600.00,
            durationNotes: 'Daily or Weekend',
            categorySlug: 'chairs',
            imageUrl: '/images/rentals/chairs/chair_gold_simple.jpg'
        },
        {
            name: 'Elegant White Chair',
            description: 'Classic white chair for weddings and formal dinners.',
            totalStock: 100,
            pricePerDay: 275.00,
            pricePerWeekend: 500.00,
            durationNotes: 'Daily or Weekend',
            categorySlug: 'chairs',
            imageUrl: '/images/rentals/chairs/chair_white_simple.jpg'
        },
        {
            name: 'Garden Chic White Chair',
            description: 'Stylish white chair perfect for outdoor ceremonies.',
            totalStock: 150,
            pricePerDay: 350.00,
            pricePerWeekend: 650.00,
            durationNotes: '1–3 days',
            categorySlug: 'chairs',
            imageUrl: '/images/rentals/chairs/white_garden_chic.jpg'
        },
        {
            name: 'Wooden Rustic Chair',
            description: 'Warm, natural wood chair for rustic and forest themes.',
            totalStock: 100,
            pricePerDay: 425.00,
            pricePerWeekend: 800.00,
            durationNotes: 'Daily rate',
            categorySlug: 'chairs',
            imageUrl: '/images/rentals/chairs/wooden_rustic_chairs.jpg'
        },
        {
            name: 'Bride & Groom Chair',
            description: 'Specially designed chair set for the bridal couple.',
            totalStock: 4,
            pricePerDay: 2250.00,
            pricePerWeekend: 4000.00,
            durationNotes: 'Per pair',
            categorySlug: 'chairs',
            imageUrl: '/images/rentals/chairs/bride_groom_chair_1.jpg'
        },

        // Curtains
        {
            name: 'Elegant Event Backdrop',
            description: 'Premium fabric backdrop for stages and photo booths.',
            totalStock: 12,
            pricePerDay: 2750.00,
            pricePerWeekend: 5000.00,
            durationNotes: 'Standard 10x10ft',
            categorySlug: 'curtains',
            imageUrl: '/images/rentals/curtains/backdrop_1.jpg'
        },
        {
            name: 'Red Velvet Curtain',
            description: 'Rich red velvet for a grand and warm atmosphere.',
            totalStock: 8,
            pricePerDay: 2000.00,
            pricePerWeekend: 3750.00,
            durationNotes: 'Per panel',
            categorySlug: 'curtains',
            imageUrl: '/images/rentals/curtains/curtain_red.jpg'
        },
        {
            name: 'Gold Premium Curtain',
            description: 'Luxurious gold fabric for high-end events.',
            totalStock: 10,
            pricePerDay: 2250.00,
            pricePerWeekend: 4000.00,
            durationNotes: 'Per panel',
            categorySlug: 'curtains',
            imageUrl: '/images/rentals/curtains/curtain_gold.jpg'
        },
        {
            name: 'White Silk Curtain',
            description: 'Soft white silk for a clean and elegant look.',
            totalStock: 15,
            pricePerDay: 1750.00,
            pricePerWeekend: 3000.00,
            durationNotes: 'Per panel',
            categorySlug: 'curtains',
            imageUrl: '/images/rentals/curtains/curtain_white.jpg'
        },
        {
            name: 'Ethiopian Theme Curtain',
            description: 'Traditional patterns for cultural backdrops.',
            totalStock: 5,
            pricePerDay: 2500.00,
            pricePerWeekend: 4500.00,
            durationNotes: 'Per panel',
            categorySlug: 'curtains',
            imageUrl: '/images/rentals/curtains/cultural_curtain.jpg'
        },

        // Floral Tools
        {
            name: 'Luxury Wedding Arch Backdrop',
            description: 'Full arch setup with premium draping.',
            totalStock: 5,
            pricePerDay: 6000.00,
            pricePerWeekend: 10000.00,
            durationNotes: 'Professional setup included',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/curtains/wedding_backdrop_arch.jpg'
        },
        {
            name: 'Tall Gold Trumpet Vases',
            description: 'Luxury 21.65" gold trumpet vases for centerpieces.',
            totalStock: 24,
            pricePerDay: 1500.00,
            pricePerWeekend: 2750.00,
            durationNotes: 'Per set of 4',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/gold_trumpet_vases.jpg'
        },
        {
            name: 'Geometric Flower Arch',
            description: 'Modern geometric design for unique floral displays.',
            totalStock: 3,
            pricePerDay: 3750.00,
            pricePerWeekend: 7000.00,
            durationNotes: 'Frame only',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/geometric_arch.jpg'
        },
        {
            name: 'Flower Row Runner',
            description: 'Detailed flower row for tables or aisles.',
            totalStock: 10,
            pricePerDay: 1250.00,
            pricePerWeekend: 2250.00,
            durationNotes: 'Per 6ft length',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/flower_runner.jpg'
        },
        {
            name: 'Silk Rose Aisle Row',
            description: 'High-quality faux roses for aisle decoration.',
            totalStock: 12,
            pricePerDay: 2000.00,
            pricePerWeekend: 3500.00,
            durationNotes: 'Per 5ft section',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/silk_rose_aisle.jpg'
        },
        {
            name: 'Ornate Metal Welcome Arch',
            description: 'Decorative welcome arch for entryways.',
            totalStock: 4,
            pricePerDay: 3000.00,
            pricePerWeekend: 5000.00,
            durationNotes: 'Professional setup',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/metal_welcome_arch.jpg'
        },
        {
            name: 'Pentagonal Background Frame',
            description: 'Unique five-sided frame for stage backgrounds.',
            totalStock: 3,
            pricePerDay: 3500.00,
            pricePerWeekend: 6250.00,
            durationNotes: 'Frame only',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/pentagonal_frame.jpg'
        },
        {
            name: 'Double Circle Arch Stand',
            description: 'Modern intersecting circles for photo backdrops.',
            totalStock: 4,
            pricePerDay: 3250.00,
            pricePerWeekend: 5750.00,
            durationNotes: 'Frame only',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/double_circle_arch.jpg'
        },
        {
            name: 'Clay Floral Vase',
            description: 'Hand-crafted clay vase for authentic floral arrangements.',
            totalStock: 20,
            pricePerDay: 450.00,
            pricePerWeekend: 800.00,
            durationNotes: 'Each',
            categorySlug: 'floral-tools',
            imageUrl: '/images/rentals/floral/clay_floral_tool.jpg'
        },

        // Rugs & Mats
        {
            name: 'Royal Event Carpet',
            description: 'Heavy plush carpet for VIP sections or stage areas.',
            totalStock: 6,
            pricePerDay: 4000.00,
            pricePerWeekend: 7500.00,
            durationNotes: 'Per 20x20ft roll',
            categorySlug: 'mats-rugs',
            imageUrl: '/images/rentals/rugs/carpet_royal.jpg'
        },
        {
            name: 'Traditional Grass Mat (Ethiopian)',
            description: 'Authentic hand-woven grass mat for cultural events.',
            totalStock: 30,
            pricePerDay: 1000.00,
            pricePerWeekend: 1750.00,
            durationNotes: 'Large size',
            categorySlug: 'mats-rugs',
            imageUrl: '/images/rentals/rugs/traditional_grass_mat.jpg'
        },
        {
            name: 'Event Aisle Runner',
            description: 'Long non-slip runner for wedding aisles.',
            totalStock: 8,
            pricePerDay: 1250.00,
            pricePerWeekend: 2250.00,
            durationNotes: '50ft length',
            categorySlug: 'mats-rugs',
            imageUrl: '/images/rentals/rugs/event_aisle_runner.jpg'
        },
        {
            name: 'Professional Stage Flooring',
            description: 'High-durability flooring for event stages.',
            totalStock: 10,
            pricePerDay: 3000.00,
            pricePerWeekend: 5500.00,
            durationNotes: 'Per 10x10ft section',
            categorySlug: 'mats-rugs',
            imageUrl: '/images/rentals/rugs/stage_flooring.jpg'
        },

        // Lighting
        {
            name: 'Curtain String Light',
            description: 'Warm white LED curtain lights for romantic backdrops.',
            totalStock: 50,
            pricePerDay: 600.00,
            pricePerWeekend: 1000.00,
            durationNotes: 'Per 10ft string',
            categorySlug: 'lighting',
            imageUrl: '/images/rentals/lighting/curtain_string_light.jpg'
        },
        {
            name: 'Cultural Lampshade',
            description: 'Hand-crafted lampshade for traditional themes.',
            totalStock: 15,
            pricePerDay: 875.00,
            pricePerWeekend: 1500.00,
            durationNotes: 'Each',
            categorySlug: 'lighting',
            imageUrl: '/images/rentals/lighting/cultural_lampshade.jpg'
        },
        {
            name: 'Vintage Edison Bulbs',
            description: 'Classic warm glow bulbs for ambient lighting.',
            totalStock: 40,
            pricePerDay: 1125.00,
            pricePerWeekend: 2000.00,
            durationNotes: 'Set of 10',
            categorySlug: 'lighting',
            imageUrl: '/images/rentals/lighting/edison_bulbs.jpg'
        },
        {
            name: 'Standard Stage Spotlights',
            description: 'Adjustable spotlights for focus lighting.',
            totalStock: 8,
            pricePerDay: 1750.00,
            pricePerWeekend: 3000.00,
            durationNotes: 'Per pair',
            categorySlug: 'lighting',
            imageUrl: '/images/rentals/lighting/stage_spotlights.jpg'
        },
        {
            name: 'Wine Bottle Cork Fairy Lights',
            description: 'Delicate mini LED lights for DIY decorations.',
            totalStock: 100,
            pricePerDay: 375.00,
            pricePerWeekend: 625.00,
            durationNotes: 'Each',
            categorySlug: 'lighting',
            imageUrl: '/images/rentals/lighting/wine_bottle_lights.jpg'
        },
        {
            name: 'Cultural Ramadan Lantern',
            description: 'Special edition lantern for holiday and cultural events.',
            totalStock: 25,
            pricePerDay: 1000.00,
            pricePerWeekend: 1750.00,
            durationNotes: 'Daily rate',
            categorySlug: 'lighting',
            imageUrl: '/images/rentals/cultural/ramadan_lantern.jpg'
        },

        // Cultural
        {
            name: 'Traditional Ethiopian Baskets',
            description: 'Set of authentic hand-woven Mesob and cultural baskets.',
            totalStock: 25,
            pricePerDay: 1750.00,
            pricePerWeekend: 3250.00,
            durationNotes: 'Per set of 6',
            categorySlug: 'cultural',
            imageUrl: '/images/rentals/cultural/cultural_baskets_1.jpg'
        },
        {
            name: 'Ethiopian Decor Set',
            description: 'High-end cultural artifacts and fabrics.',
            totalStock: 10,
            pricePerDay: 2500.00,
            pricePerWeekend: 4500.00,
            durationNotes: 'Daily rate',
            categorySlug: 'cultural',
            imageUrl: '/images/rentals/cultural/cultural_decor_1.jpg'
        },
        {
            name: 'Cultural Backdrop Setup',
            description: 'Complete backdrop for traditional photography segments.',
            totalStock: 5,
            pricePerDay: 4500.00,
            pricePerWeekend: 8000.00,
            durationNotes: 'Professional setup',
            categorySlug: 'cultural',
            imageUrl: '/images/rentals/cultural/cultural_backdrop.jpg'
        },
        {
            name: 'Traditional Mesob Backdrop',
            description: 'Specialized backdrop featuring large traditional baskets.',
            totalStock: 3,
            pricePerDay: 3750.00,
            pricePerWeekend: 6500.00,
            durationNotes: 'Professional setup',
            categorySlug: 'cultural',
            imageUrl: '/images/rentals/cultural/mesob_backdrop.jpg'
        },
        {
            name: 'Traditional Mesob Basket',
            description: 'Large hand-woven Mesob for traditional ceremonies.',
            totalStock: 15,
            pricePerDay: 1250.00,
            pricePerWeekend: 2250.00,
            durationNotes: 'Each',
            categorySlug: 'cultural',
            imageUrl: '/images/rentals/cultural/mesob.jpg'
        },
        {
            name: 'Cultural Decor Piece',
            description: 'Detailed cultural ornament for traditional setups.',
            totalStock: 10,
            pricePerDay: 750.00,
            pricePerWeekend: 1250.00,
            durationNotes: 'Each',
            categorySlug: 'cultural',
            imageUrl: '/images/rentals/cultural/cultu.jpg'
        },

        // Others
        {
            name: 'Modern Decor Vase',
            description: 'Sleek modern vase for minimalist styling.',
            totalStock: 15,
            pricePerDay: 1000.00,
            pricePerWeekend: 1750.00,
            durationNotes: 'Each',
            categorySlug: 'others-rental',
            imageUrl: '/images/rentals/others/modern_vase.jpg'
        },
        {
            name: 'Iron Stand',
            description: 'Versatile iron stand for displays or signs.',
            totalStock: 10,
            pricePerDay: 750.00,
            pricePerWeekend: 1250.00,
            durationNotes: 'Each',
            categorySlug: 'others-rental',
            imageUrl: '/images/rentals/others/iron_stand.jpg'
        },
        {
            name: 'Welcome Sign Display',
            description: 'Classic welcome sign for event entryways.',
            totalStock: 8,
            pricePerDay: 625.00,
            pricePerWeekend: 1125.00,
            durationNotes: 'Frame included',
            categorySlug: 'others-rental',
            imageUrl: '/images/rentals/others/welcome_sign.jpg'
        },
        {
            name: 'Portable Modular Stage',
            description: 'Expandable stage system for speeches and performances.',
            totalStock: 1,
            pricePerDay: 11250.00,
            pricePerWeekend: 20000.00,
            durationNotes: 'Standard 12x12ft',
            categorySlug: 'others-rental',
            imageUrl: '/images/rentals/others/portable_stage.jpg'
        },
        {
            name: 'Classic Centerpiece Vase',
            description: 'Traditional vase for elegant dining tables.',
            totalStock: 30,
            pricePerDay: 500.00,
            pricePerWeekend: 875.00,
            durationNotes: 'Each',
            categorySlug: 'others-rental',
            imageUrl: '/images/rentals/others/classic_vase.jpg'
        },
        {
            name: 'Semi-Circle Wedding Altar',
            description: 'Graceful semi-circle frame for ceremony altars.',
            totalStock: 3,
            pricePerDay: 5500.00,
            pricePerWeekend: 9500.00,
            durationNotes: 'Daily rate',
            categorySlug: 'others-rental',
            imageUrl: '/images/rentals/others/semi_circle_altar.jpg'
        }
    ];

    for (const item of inventoryItems) {
        const category = await prisma.rentalCategory.findUnique({
            where: { slug: item.categorySlug }
        });

        if (category) {
            await prisma.inventoryItem.create({
                data: {
                    name: item.name,
                    description: item.description,
                    totalStock: item.totalStock,
                    pricePerDay: item.pricePerDay,
                    pricePerWeekend: item.pricePerWeekend,
                    durationNotes: item.durationNotes,
                    categoryId: category.id,
                    imageUrl: item.imageUrl
                }
            });
        }
    }
    console.log('Full rental inventory seeded.');

    // Add sample PastWork for all categories
    const categories = await prisma.eventCategory.findMany();

    const worksData: any = {
        wedding: [
            { title: 'Gold Theme Wedding', description: 'Grand gold and white wedding decor', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/Wedding_1.jpg`], eventDate: new Date('2024-06-12') },
            { title: 'Romantic Candlelit Ceremony', description: 'Intimate ceremony setup', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/wedding_2.jpg`], eventDate: new Date('2024-06-12') },
            { title: 'Elegant Garden Wedding', description: 'Fresh floral setup for outdoor wedding', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/wedding_3.jpg`], eventDate: new Date('2024-07-15') },
            { title: 'Luxury Pink Floral', description: 'Pink floral theme decoration', imageUrls: ['/images/gallery/weddings/wedding_4.jpg'], eventDate: new Date('2024-07-15') },
            { title: 'Classic White Ceremony', description: 'Timeless white silk and rose decor', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/wedding_5.jpg`], eventDate: new Date('2024-08-20') },
            { title: 'Modern Wedding Elegance', description: 'Contemporary wedding styling', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/Wedding_6.jpg`], eventDate: new Date('2024-08-20') },
            { title: 'Luxury Arch Setup', description: 'Premium floral arch for a modern wedding', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/Wedding_7.jpg`], eventDate: new Date('2024-09-05') },
            { title: 'Royal Stage Decor', description: 'Grand stage design for reception', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/weddings/Wedding_8.jpg`], eventDate: new Date('2024-09-05') }
        ],
        birthday: [
            { title: 'Fun Birthday Bash', description: 'Colorful and vibrant party decor', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/birthdays/Birthday_1.jpg`], eventDate: new Date('2024-05-10') },
            { title: 'Birthday Celebration', description: 'Festive setup for birthday event', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/birthdays/Birthday_2.jpg`], eventDate: new Date('2024-05-10') },
            { title: 'Kids Theme Party', description: 'Playful and safe decoration for children', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/birthdays/Birthday_3.jpg`], eventDate: new Date('2024-08-12') },
            { title: 'Birthday Table Setup', description: 'Detailed table arrangement', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/birthdays/Birthday_4.jpg`], eventDate: new Date('2024-08-12') }
        ],
        engagement: [
            { title: 'Proposal Surprise', description: 'Intimate and romantic proposal setup', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/engagements/Engagement_1.jpg`], eventDate: new Date('2024-02-14') },
            { title: 'Engagement Ring Setting', description: 'Beautiful backdrop for ring exchange', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/engagements/Engagement_2.jpg`], eventDate: new Date('2024-02-14') },
            { title: 'Engagement Dinner', description: 'Elegant dining decor for engagement parties', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/engagements/Engagement_3.jpg`], eventDate: new Date('2024-04-18') },
            { title: 'Traditional Engagement', description: 'Cultural elements for engagement', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/engagements/Engagement_4.jpg`], eventDate: new Date('2024-04-18') }
        ],
        graduation: [
            { title: 'Graduation Gala', description: 'Celebrating academic milestones in style', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/graduations/Grad_1.jpg`], eventDate: new Date('2024-07-22') },
            { title: 'Graduation Stage', description: 'Podium and stage decoration', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/graduations/Grad_2.jpg`], eventDate: new Date('2024-07-22') },
            { title: 'Class of 2024 Party', description: 'Modern and energetic graduation decor', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/graduations/Grad_3.jpg`], eventDate: new Date('2024-11-30') },
            { title: 'Graduation Photo Booth', description: 'Themed backdrop for photos', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/graduations/Grad_4.jpg`], eventDate: new Date('2024-11-30') }
        ],
        corporate: [
            { title: 'Annual Corporate Gala', description: 'Professional and branded event styling', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/corporate/Corp_1.jpg`], eventDate: new Date('2024-12-05') },
            { title: 'Corporate Dinner', description: 'Formal dining setup for executives', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/corporate/Corp_2.jpg`], eventDate: new Date('2024-12-05') },
            { title: 'Tech Innovation Summit', description: 'Sleek and modern tech conference decor', imageUrls: [`${BASE_IMAGE_URL}/images/gallery/corporate/Corp_3.jpg`], eventDate: new Date('2024-11-15') }
        ]
    };

    for (const cat of categories) {
        const works = worksData[cat.slug];
        if (works) {
            for (const pw of works) {
                await prisma.pastWork.create({
                    data: {
                        ...pw,
                        categoryId: cat.id
                    }
                });
            }
            console.log(`PastWorks added for ${cat.name}.`);
        }
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