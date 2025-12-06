import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { productsApi } from '../api/products';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, ShoppingBag, ArrowRight, RefreshCcw } from 'lucide-react';
import { useCart } from '../features/cart/context/CartContext';
import { useToast } from './ui/use-toast';
import { ProductSkeletonGrid } from './ProductSkeletonGrid';
import { getProductImage } from '../shared/utils/productAssets';
import { cn } from '../lib/utils';

export function AnimatedProductList() {
    const { data: products, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });
    const { addToCart } = useCart();
    const { toast } = useToast();

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
                    <Button asChild variant="link" className="text-[#1a1a1a] text-lg font-semibold hover:text-lime-600 transition-colors group">
                        <Link to="/products">
                            View All Products <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <ProductSkeletonGrid count={4} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 text-center">
                        <p className="text-lg font-semibold text-foreground">Unable to load trending picks</p>
                        <p className="text-muted-foreground">{error instanceof Error ? error.message : "Please try again shortly."}</p>
                        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                            <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
                            Retry
                        </Button>
                    </div>
                ) : featured.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
                        No products available yet. Check back soon.
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
                            const imageSrc = getProductImage(product.flavour);

                            return (
                                <motion.div key={product.flavour} variants={item}>
                                    <Link
                                        to="/product/$flavour"
                                        params={{ flavour: product.flavour }}
                                        className="group h-full flex flex-col"
                                    >
                                        <div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center bg-[#f0f0f0] mb-4 rounded-xl">

                                            {/* Product Image */}
                                            <img
                                                src={imageSrc}
                                                alt={product.flavour}
                                                className="w-4/5 h-4/5 object-contain filter drop-shadow-xl transform transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Quick Add Overlay */}
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    className="bg-[#1a1a1a] hover:bg-lime-500 hover:text-[#1a1a1a] font-bold uppercase shadow-lg gap-2 rounded-full px-8 py-6"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(product, 1);
                                                        toast({
                                                            title: "Added to cart",
                                                            description: `${product.flavour} has been added to your cart.`,
                                                        });
                                                    }}
                                                >
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
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

