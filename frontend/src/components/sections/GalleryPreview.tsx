"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrls: string[];
    category: {
        name: string;
        slug: string;
    };
}

const GalleryPreview = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Hardcoded wedding projects
    const weddingProjects: Project[] = [
        {
            id: 'wedding-1',
            title: 'Wedding',
            description: 'Grand Ballroom Wedding',
            imageUrls: ['/images/gallery/weddings/Wedding_1.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-2',
            title: 'Wedding',
            description: 'Romantic Candlelit Ceremony',
            imageUrls: ['/images/gallery/weddings/wedding_2.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-3',
            title: 'Wedding',
            description: 'Elegant White Stage',
            imageUrls: ['/images/gallery/weddings/wedding_3.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-4',
            title: 'Wedding',
            description: 'Luxury Pink Floral',
            imageUrls: ['/images/gallery/weddings/wedding_4.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-5',
            title: 'Wedding',
            description: 'Forever Begins Tonight',
            imageUrls: ['/images/gallery/weddings/wedding_5.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-6',
            title: 'Wedding',
            description: 'Classic Wedding Elegance',
            imageUrls: ['/images/gallery/weddings/Wedding_6.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-7',
            title: 'Wedding',
            description: 'Dreamy Wedding Reception',
            imageUrls: ['/images/gallery/weddings/Wedding_7.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-8',
            title: 'Wedding',
            description: 'Royal Wedding Ceremony',
            imageUrls: ['/images/gallery/weddings/Wedding_8.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-9',
            title: 'Wedding',
            description: 'Garden Wedding Paradise',
            imageUrls: ['/images/gallery/weddings/Wedding_9.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        },
        {
            id: 'wedding-10',
            title: 'Wedding',
            description: 'Modern Wedding Glamour',
            imageUrls: ['/images/gallery/weddings/Wedding_10.jpg'],
            category: { name: 'Wedding', slug: 'wedding' }
        }
    ];

    // Hardcoded birthday projects
    const birthdayProjects: Project[] = [
        {
            id: 'birthday-1',
            title: 'Birthday',
            description: 'Vibrant Birthday Decor',
            imageUrls: ['/images/gallery/birthdays/Birthday_1.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        },
        {
            id: 'birthday-2',
            title: 'Birthday',
            description: 'Creative Birthday Setup',
            imageUrls: ['/images/gallery/birthdays/Birthday_2.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        },
        {
            id: 'birthday-3',
            title: 'Birthday',
            description: 'Elegant Birthday Party',
            imageUrls: ['/images/gallery/birthdays/Birthday_3.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        },
        {
            id: 'birthday-4',
            title: 'Birthday',
            description: 'Themed Birthday Celebration',
            imageUrls: ['/images/gallery/birthdays/Birthday_4.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        },
        {
            id: 'birthday-5',
            title: 'Birthday',
            description: 'Modern Birthday Style',
            imageUrls: ['/images/gallery/birthdays/Birthday_5.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        },
        {
            id: 'birthday-6',
            title: 'Birthday',
            description: 'Classic Birthday Decor',
            imageUrls: ['/images/gallery/birthdays/Birthday_6.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        },
        {
            id: 'birthday-7',
            title: 'Birthday',
            description: 'Grand Birthday Celebration',
            imageUrls: ['/images/gallery/birthdays/Birthday_7.jpg'],
            category: { name: 'Birthday', slug: 'birthday' }
        }
    ];

    // Hardcoded graduation projects
    const graduationProjects: Project[] = [
        {
            id: 'grad-1',
            title: 'Graduation',
            description: 'Stunning Graduation Stage',
            imageUrls: ['/images/gallery/graduations/Grad_1.jpg'],
            category: { name: 'Graduation', slug: 'graduation' }
        },
        {
            id: 'grad-2',
            title: 'Graduation',
            description: 'Elegant Graduation Decor',
            imageUrls: ['/images/gallery/graduations/Grad_2.jpg'],
            category: { name: 'Graduation', slug: 'graduation' }
        },
        {
            id: 'grad-3',
            title: 'Graduation',
            description: 'Classy Graduation Setup',
            imageUrls: ['/images/gallery/graduations/Grad_3.jpg'],
            category: { name: 'Graduation', slug: 'graduation' }
        },
        {
            id: 'grad-4',
            title: 'Graduation',
            description: 'Modern Graduation Style',
            imageUrls: ['/images/gallery/graduations/Grad_4.jpg'],
            category: { name: 'Graduation', slug: 'graduation' }
        }
    ];

    // Hardcoded engagement projects
    const engagementProjects: Project[] = [
        {
            id: 'eng-1',
            title: 'Engagement',
            description: 'Romantic Engagement Backdrop',
            imageUrls: ['/images/gallery/engagements/Engagement_1.jpg'],
            category: { name: 'Engagement', slug: 'engagement' }
        },
        {
            id: 'eng-2',
            title: 'Engagement',
            description: 'Luxury Engagement Setup',
            imageUrls: ['/images/gallery/engagements/Engagement_2.jpg'],
            category: { name: 'Engagement', slug: 'engagement' }
        },
        {
            id: 'eng-3',
            title: 'Engagement',
            description: 'Elegant Engagement Decor',
            imageUrls: ['/images/gallery/engagements/Engagement_3.jpg'],
            category: { name: 'Engagement', slug: 'engagement' }
        },
        {
            id: 'eng-4',
            title: 'Engagement',
            description: 'Traditional Engagement Style',
            imageUrls: ['/images/gallery/engagements/Engagement_4.jpg'],
            category: { name: 'Engagement', slug: 'engagement' }
        }
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/portfolio/projects?limit=5');
                const apiProjects = res.data || [];

                // Create a representative mix for the home page (total 6 projects)
                const mixedProjects = [
                    weddingProjects[0],
                    birthdayProjects[0],
                    graduationProjects[0],
                    engagementProjects[0],
                    weddingProjects[1],
                    birthdayProjects[1]
                ].filter(Boolean); // Filter out any undefined if arrays are shorter than expected

                setProjects(mixedProjects);
            } catch (err) {
                console.error('Failed to fetch projects', err);
                // Fallback to purely hardcoded mix
                const mixedProjects = [
                    weddingProjects[0],
                    birthdayProjects[0],
                    graduationProjects[0],
                    engagementProjects[0],
                    weddingProjects[1],
                    birthdayProjects[1]
                ].filter(Boolean);
                setProjects(mixedProjects);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="py-24 px-6 bg-white text-center">
                <p className="text-gray-500 font-serif italic">Loading our masterpieces...</p>
            </section>
        );
    }

    // fallback layout if no projects
    if (projects.length === 0) {
        return null;
    }

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-900 mb-4">Our Masterpieces</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="mt-6 text-gray-500 max-w-2xl mx-auto">
                        A glimpse into the extraordinary transformations we&apos;ve created for our clients.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative h-80 overflow-hidden rounded-2xl bg-gray-100 shadow-lg"
                        >
                            {/* Image placeholder - normally you'd use item.imageUrls[0] */}
                            <div className="absolute inset-0 bg-gold-900/10 group-hover:bg-gold-900/40 transition-all duration-500 z-10" />
                            {item.imageUrls && item.imageUrls.length > 0 ? (
                                <img
                                    src={item.imageUrls[0]}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-gold-300 font-serif italic text-2xl opacity-50">
                                    {item.category.name}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1">{item.category.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="/gallery"
                        className="inline-block px-8 py-3 bg-gold-800 text-white font-semibold rounded-full hover:bg-gold-700 transition-colors shadow-md"
                    >
                        View Full Portfolio
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
