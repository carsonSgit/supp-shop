import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Star, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useCart } from '../features/cart/context/CartContext';
import { useToast } from '../components/ui/use-toast';
import { getProductImage } from '../shared/utils/productAssets';
import { cn } from '../lib/utils';

export default function ProductDetail() {
    const { flavour } = useParams({ strict: false });
    const { addToCart } = useCart();
    const { toast } = useToast();

    const { data: products, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });

    const product = products?.find(p => p.flavour === flavour);
    const imageSrc = getProductImage(product?.flavour);

    const nutrition = product?.nutrition;
    const ingredients = product?.ingredients;
    const benefits = product?.benefits;
    const rating = product?.rating;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-lime-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-2xl font-bold">We couldn't load this product</h1>
                <p className="text-muted-foreground max-w-md">{error instanceof Error ? error.message : "Please check your connection and try again."}</p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
                        Retry
                    </Button>
                    <Link to="/products">
                        <Button variant="ghost">Back to shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link to="/products">
                <Button>Back to Shop</Button>
            </Link>
        </div>
    );

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, 1);
            toast({
                title: "Item added to cart",
                description: `${product.flavour} has been added to your cart.`,
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f7f8] pb-24">
            <div className="container py-8">
                <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
                </Link>
            </div>

            <main className="container grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 items-start">

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative flex items-center justify-center min-h-[640px] px-6"
                >
                    <img
                        src={imageSrc}
                        alt={product.flavour}
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10 lg:pt-4"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-[#e8f5d0] text-[#5f8a1f] font-black uppercase tracking-[0.18em] text-xs px-3 py-1">
                                {product.type || "Type not set"}
                            </span>
                            <div className="flex items-center gap-1 text-[#f2b800] font-semibold text-sm">
                                <Star className="h-4 w-4 fill-current" />
                                {rating !== undefined ? rating : "No rating"}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1a1a1a] leading-tight">
                            {product.flavour}
                        </h1>
                        <p className="text-3xl font-bold text-[#1a1a1a] tracking-tight">
                            ${String(product.price)}
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                            {product.description || "Optional description for the product"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-serif font-bold text-2xl text-[#1a1a1a]">Product Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#1a1a1a]">
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="font-semibold">Flavour</span>
                                <span>{product.flavour}</span>
                            </div>
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="font-semibold">Type</span>
                                <span>{product.type || "—"}</span>
                            </div>
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="font-semibold">Price</span>
                                <span>${String(product.price)}</span>
                            </div>
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="font-semibold">Rating</span>
                                <span>{rating !== undefined ? rating : "—"}</span>
                            </div>
                        </div>
                        <div className="border-b border-border pb-2">
                            <span className="font-semibold block">Description</span>
                            <p className="text-muted-foreground text-sm mt-1">
                                {product.description || "Optional description for the product"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-serif font-bold text-xl text-[#1a1a1a]">Ingredients</h3>
                            <ul className="list-disc list-inside text-sm text-[#1a1a1a] space-y-1">
                                {ingredients && ingredients.length > 0
                                    ? ingredients.map((item) => <li key={item}>{item}</li>)
                                    : <li className="text-muted-foreground">No ingredients provided</li>}
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-serif font-bold text-xl text-[#1a1a1a]">Benefits</h3>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm font-semibold text-[#1a1a1a]">
                                {benefits && benefits.length > 0 ? benefits.map((benefit, i) => (
                                    <div key={benefit + i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-[#6abf4b]" />
                                        {benefit}
                                    </div>
                                )) : (
                                    <div className="text-muted-foreground col-span-2">No benefits provided</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={handleAddToCart}
                            size="lg"
                            variant="default"
                            className="w-full rounded-none text-lg font-bold uppercase tracking-wide py-6 text-[#1a1a1a]"
                        >
                            Add to Cart - ${String(product.price)}
                        </Button>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                        <h3 className="font-serif font-bold text-2xl text-[#1a1a1a]">Nutrition Facts</h3>
                        <div className="grid grid-cols-4 divide-x divide-border text-center bg-white shadow-sm">
                            <div className="p-6">
                                <div className="text-3xl font-bold text-[#1a1a1a]">{nutrition?.calories ?? "—"}</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Cals</div>
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold text-[#1a1a1a]">{nutrition?.protein !== undefined ? `${nutrition.protein}g` : "—"}</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Prot</div>
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold text-[#1a1a1a]">{nutrition?.carbs !== undefined ? `${nutrition.carbs}g` : "—"}</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Carbs</div>
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold text-[#1a1a1a]">{nutrition?.fat !== undefined ? `${nutrition.fat}g` : "—"}</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Fat</div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
