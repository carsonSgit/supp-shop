import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Mountain, ShieldCheck, Truck, Award } from 'lucide-react';
import { cn } from '../lib/utils';

interface BentoCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    delay?: number;
}

function BentoCard({ title, description, icon, className, delay = 0 }: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl bg-card p-6 shadow-sm border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 120 })}
            </div>

            <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

export function BentoFeatures() {
    return (
        <section className="py-24 container">
            <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight italic"
                >
                    Why Choose <span className="text-primary">Nature?</span>
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

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-auto md:h-[600px]">
                {/* Large Card - 100% Organic */}
                <BentoCard
                    title="100% Organic Sourcing"
                    description="Our ingredients are harvested from certified organic farms that prioritize soil health and sustainability. No pesticides, no GMOs, just pure nature."
                    icon={<Leaf className="h-6 w-6" />}
                    className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
                    delay={0.1}
                />

                {/* Tall Card - Pure Extraction */}
                <BentoCard
                    title="Cold-Press Extraction"
                    description="We use advanced cold-press technology to ensure maximum potency and nutrient retention in every drop."
                    icon={<Droplets className="h-6 w-6" />}
                    className="md:col-span-1 md:row-span-2"
                    delay={0.2}
                />

                {/* Small Card - Lab Tested */}
                <BentoCard
                    title="3rd Party Lab Tested"
                    description="Every batch is rigorously tested for purity."
                    icon={<ShieldCheck className="h-6 w-6" />}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.3}
                />

                {/* Small Card - Peak Performance */}
                <BentoCard
                    title="Peak Performance"
                    description="Formulated for elite athletes."
                    icon={<Mountain className="h-6 w-6" />}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.4}
                />
            </div>
        </section>
    );
}
