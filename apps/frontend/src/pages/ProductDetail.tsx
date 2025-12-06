import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Star, Award, RefreshCcw } from "lucide-react";
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

    // We fetch all products and find the one matching the flavour
    // In a real app, we'd have a getByFlavour API endpoint
    const { data: products, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });

    const product = products?.find(p => p.flavour === flavour);
    const imageSrc = getProductImage(product?.flavour);

    // Fake extra data for demo since older products don't have it in DB yet
    const nutrition = product?.nutrition || { calories: 120, protein: 24, carbs: 3, fat: 1 };
    const ingredients = product?.ingredients || ["Whey Protein Isolate", "Cocoa Powder", "Natural Flavors", "Stevia Leaf Extract", "Sea Salt"];
    const benefits = product?.benefits || ["Muscle Recovery", "Fast Absorption", "Great Taste", "Keto Friendly"];
    const rating = product?.rating || 4.9;

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
        <div className="min-h-screen bg-background pb-24">
            {/* Header / Nav Back */}
            <div className="container py-8">
                <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
                </Link>
            </div>

            <main className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left: Image (Flat) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-12 relative overflow-hidden flex items-center justify-center min-h-[600px]"
                >
                    <img
                        src={imageSrc}
                        alt={product.flavour}
                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    />
                </motion.div>

                {/* Right: Info */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10 lg:pt-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lime-600 font-bold uppercase tracking-wider text-sm">
                            <span className="bg-lime-100 px-3 py-1">{product.type}</span>
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1">
                                <Star className="h-4 w-4 fill-current" /> {rating}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                            {product.flavour}
                        </h1>
                        <p className="text-3xl font-mono font-bold text-foreground">
                            ${String(product.price)}
                        </p>
                    </div>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {product.description || "Premium quality supplement crafted for peak performance. Featuring ultra-pure ingredients and rapid absorption technology."}
                    </p>

                    {/* Quick Benefits (Flat) */}
                    <div className="grid grid-cols-2 gap-4">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-transparent">
                                <Award className="h-5 w-5 text-lime-500" />
                                <span className="font-bold text-foreground text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-border">
                        <Button onClick={handleAddToCart} size="lg" className="flex-1 text-lg font-bold uppercase tracking-wide">
                            Add to Cart - ${String(product.price)}
                        </Button>
                    </div>

                    {/* Nutrition Accordion Style (Flat) */}
                    <div className="space-y-6 pt-8 border-t border-border">
                        <h3 className="font-serif font-bold text-2xl">Nutrition Facts</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-transparent border-r border-border last:border-0">
                                <div className="text-2xl font-bold text-foreground">{nutrition.calories}</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold">Cals</div>
                            </div>
                            <div className="p-4 bg-transparent border-r border-border last:border-0">
                                <div className="text-2xl font-bold text-foreground">{nutrition.protein}g</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold">Prot</div>
                            </div>
                            <div className="p-4 bg-transparent border-r border-border last:border-0">
                                <div className="text-2xl font-bold text-foreground">{nutrition.carbs}g</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold">Carbs</div>
                            </div>
                            <div className="p-4 bg-transparent">
                                <div className="text-2xl font-bold text-foreground">{nutrition.fat}g</div>
                                <div className="text-xs text-muted-foreground uppercase font-bold">Fat</div>
                            </div>
                        </div>

                        <div className="bg-transparent pt-4">
                            <h4 className="font-bold uppercase text-sm text-muted-foreground mb-3">Ingredients</h4>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {ingredients.join(", ")}
                            </p>
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
