import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

export function FeaturedProducts() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });

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
                <Button variant="link" className="text-primary text-lg font-semibold hover:text-primary/80 transition-colors">
                    View All Products &rarr;
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featured.map((product) => (
                        <Card key={product.flavour} className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                            <div className="aspect-square bg-secondary/10 relative overflow-hidden flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                {/* Placeholder for product image */}
                                <div className="text-muted-foreground/20 text-7xl font-black uppercase rotate-[-15deg] select-none">
                                    {(product.type || 'Supplement').split(' ')[0]}
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-40" />

                                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <Button className="w-full font-bold uppercase bg-white text-primary hover:bg-primary hover:text-white shadow-md">
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
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">{product.description || "Premium quality supplement for your daily needs."}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
