import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { productsApi } from '../api/products';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, RefreshCcw, ShoppingBag } from 'lucide-react';
import { useCart } from '../features/cart/context/CartContext';
import { useToast } from './ui/use-toast';
import { ProductSkeletonGrid } from './ProductSkeletonGrid';
import { getProductImage } from '../shared/utils/productAssets';
import { cn } from '../lib/utils';

export function FeaturedProducts() {
    const { data: products, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });
    const { addToCart } = useCart();
    const { toast } = useToast();

    const featured = products?.slice(0, 3) || [];

    return (
        <section className="py-24 container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight italic text-foreground">
                        Trending <span className="text-primary">Now</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">Top rated supplements chosen by athletes.</p>
                </div>
                <Button asChild variant="link" className="text-primary text-lg font-semibold hover:text-primary/80 transition-colors">
                    <Link to="/products">View All Products &rarr;</Link>
                </Button>
            </div>

            {isLoading ? (
                <ProductSkeletonGrid count={3} className="md:grid-cols-3" />
            ) : isError ? (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
                    <p className="text-lg font-semibold text-foreground">Unable to load featured products</p>
                    <p className="text-muted-foreground">{error instanceof Error ? error.message : "Please try again shortly."}</p>
                    <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
                        Retry
                    </Button>
                </div>
            ) : featured.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
                    No featured products yet. Check back soon.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featured.map((product) => (
                        <Link
                            key={product.flavour}
                            to="/product/$flavour"
                            params={{ flavour: product.flavour }}
                            className="group"
                        >
                            <Card className="overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
                                <div className="aspect-[4/5] bg-secondary/10 relative overflow-hidden flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                    <img
                                        src={getProductImage(product.flavour)}
                                        alt={product.flavour}
                                        className="w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-30" />

                                    <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <Button
                                            type="button"
                                            className="w-full font-bold uppercase bg-white text-primary hover:bg-primary hover:text-white shadow-md"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product, 1);
                                                toast({
                                                    title: "Added to cart",
                                                    description: `${product.flavour} has been added to your cart.`,
                                                });
                                            }}
                                        >
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            Quick Add
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 backdrop-blur-sm">{product.type}</Badge>
                                        <span className="font-bold text-xl font-mono text-primary">${String(product.price)}</span>
                                    </div>
                                    <CardTitle className="text-2xl uppercase italic tracking-wide text-foreground">{product.flavour}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description || "Premium quality supplement for your daily needs."}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
