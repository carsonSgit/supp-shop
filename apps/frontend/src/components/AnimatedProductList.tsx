import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

import proteinChoc from '../assets/products/protein_chocolate.png';
import proteinVanilla from '../assets/products/protein_vanilla.png';
import prePunch from '../assets/products/preworkout_punch.png';

const productImages: Record<string, string> = {
    'Chocolate': proteinChoc,
    'Vanilla': proteinVanilla,
    'Fruit Punch': prePunch
};

// Fallback for unknown flavors/types
const defaultImage = proteinChoc;

export function AnimatedProductList() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });

    const featured = products?.slice(0, 4) || [];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-24 bg-[#fafafa]">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
                            Trending <span className="text-lime-500 italic font-serif">Now</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">Top rated supplements chosen by athletes.</p>
                    </div>
                    <Button variant="link" className="text-[#1a1a1a] text-lg font-semibold hover:text-lime-600 transition-colors group">
                        View All Products <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-lime-500" />
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {featured.map((product) => {
                            const imageSrc = productImages[product.flavour] || defaultImage;

                            return (
                                <motion.div key={product.flavour} variants={item}>
                                    <div className="group h-full flex flex-col">
                                        <div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center bg-[#f0f0f0] mb-4 rounded-xl">

                                            {/* Product Image */}
                                            <img
                                                src={imageSrc}
                                                alt={product.flavour}
                                                className="w-4/5 h-4/5 object-contain filter drop-shadow-xl transform transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Quick Add Overlay */}
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Button className="bg-[#1a1a1a] hover:bg-lime-500 hover:text-[#1a1a1a] font-bold uppercase shadow-lg gap-2 rounded-full px-8 py-6">
                                                    <ShoppingBag className="h-4 w-4" /> Quick Add
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-serif italic tracking-wide text-[#1a1a1a]" title={product.flavour}>
                                                    {product.flavour}
                                                </h3>
                                                <span className="font-bold font-mono text-lime-600">${String(product.price)}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {product.type}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

