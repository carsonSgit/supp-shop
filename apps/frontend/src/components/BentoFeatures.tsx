import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, Mountain, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import CardSwap, { Card } from './CardSwap';

// Define the content for the features
const FEATURES = [
    {
        title: "100% Organic Sourcing",
        description: "Our ingredients are harvested from certified organic farms that prioritize soil health and sustainability. No pesticides, no GMOs, just pure nature.",
        icon: <Leaf className="h-8 w-8" />,
        image: "/feature_organic.png",
        bgClass: "bg-[#F0FDF4]", // Light green
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        title: "Cold-Press Extraction",
        description: "We use advanced cold-press technology to ensure maximum potency and nutrient retention in every drop.",
        icon: <Droplets className="h-8 w-8" />,
        image: "/feature_cold_press.png",
        bgClass: "bg-[#F0F9FF]", // Light blue
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    {
        title: "3rd Party Lab Tested",
        description: "Every batch is rigorously tested for purity to ensure you get exactly what's on the label. Zero compromise on safety.",
        icon: <ShieldCheck className="h-8 w-8" />,
        image: "/feature_lab.png",
        bgClass: "bg-[#F5F3FF]", // Light purple
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600"
    },
    {
        title: "Peak Performance",
        description: "Formulated for elite athletes who demand the absolute best from their body and their fuel.",
        icon: <Mountain className="h-8 w-8" />,
        image: "/feature_performance.png",
        bgClass: "bg-[#FFF7ED]", // Light orange
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600"
    }
];

export function BentoFeatures() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-24 container">
            <div className="mb-20 text-center max-w-3xl mx-auto space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight italic"
                >
                    Why Choose <span className="text-lime-600">Nature?</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-muted-foreground"
                >
                    We don't just sell supplements; we deliver the purest form of energy Earth has to offer.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">

                {/* Left Side: Dynamic Text Content */}
                <div className="h-full min-h-[400px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className={cn(
                                "p-0 flex flex-col justify-start transition-colors duration-500 bg-transparent text-foreground",
                            )}
                        >
                            <motion.div
                                className={cn(
                                    "mb-6 inline-flex h-16 w-16 items-center justify-center transition-colors text-foreground ring-1 ring-border/10 rounded-none bg-transparent"
                                )}
                            >
                                {FEATURES[activeIndex].icon}
                            </motion.div>
                            <h3 className="text-4xl font-serif italic font-bold tracking-tight text-foreground mb-4">
                                {FEATURES[activeIndex].title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {FEATURES[activeIndex].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Visual Stack */}
                <div className="flex items-center justify-center pt-12 lg:pt-0 h-[500px] w-full relative">
                    <CardSwap
                        width={340}
                        height={400}
                        cardDistance={50}
                        verticalDistance={40}
                        delay={4000}
                        pauseOnHover={true}
                        skewAmount={2}
                        onSwap={(idx) => setActiveIndex(idx)}
                    >
                        {FEATURES.map((feature, idx) => (
                            <Card
                                key={idx}
                                customClass="bg-white p-2 pb-2 shadow-2xl border border-gray-100 flex flex-col cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                {/* Polaroid "Photo" Area */}
                                <div className={cn(
                                    "h-[80%] w-full relative overflow-hidden bg-gray-50",
                                    "border-b border-gray-100"
                                )}>
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="h-full w-full object-cover"
                                    />
                                    {/* Subtle overlay for depth */}
                                    <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500" />
                                </div>

                                {/* Polaroid "Label" Area */}
                                <div className="h-[20%] flex flex-col items-center justify-center text-center bg-white pt-2">
                                    <h3 className="text-lg font-bold uppercase tracking-tight text-foreground px-2 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <span className="font-serif italic text-xs text-gray-500 mt-1">Feature 0{idx + 1}</span>
                                </div>
                            </Card>
                        ))}
                    </CardSwap>
                </div>
            </div>
        </section>
    );
}
