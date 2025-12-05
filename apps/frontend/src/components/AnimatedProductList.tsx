import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

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
        <section className="py-24 bg-secondary/5">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight italic">
                            Trending <span className="text-primary">Now</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">Top rated supplements chosen by athletes.</p>
                    </div>
                    <Button variant="link" className="text-primary text-lg font-semibold hover:text-primary/80 transition-colors group">
                        View All Products <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {featured.map((product) => (
                            <motion.div key={product.flavour} variants={item}>
                                <Card className="group h-full overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 flex flex-col">
                                    <div className="aspect-[4/5] bg-secondary/10 relative overflow-hidden flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                        {/* Dynamic Background Shape */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Product Placeholder */}
                                        <div className="text-muted-foreground/20 text-5xl font-black uppercase rotate-[-90deg] select-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-75deg]">
                                            {(product.type || 'Item').split(' ')[0]}
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="secondary" className="backdrop-blur-md bg-white/50 dark:bg-black/50 border-0">
                                                {product.type}
                                            </Badge>
                                        </div>

                                        {/* Quick Add Overlay */}
                                        <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                            <Button className="w-full font-bold uppercase shadow-lg gap-2">
                                                <ShoppingBag className="h-4 w-4" /> Quick Add
                                            </Button>
                                        </div>
                                    </div>

                                    <CardHeader className="p-5 pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg uppercase italic tracking-wide line-clamp-1" title={product.flavour}>
                                                {product.flavour}
                                            </CardTitle>
                                            <span className="font-bold font-mono text-primary">${String(product.price)}</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-0 flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description || "Premium quality supplement for your daily needs."}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
