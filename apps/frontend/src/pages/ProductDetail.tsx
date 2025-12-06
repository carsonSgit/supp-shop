import React, { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Star, RefreshCcw, CheckCircle2, Minus, Plus } from "lucide-react";
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useCart } from '../features/cart/context/CartContext';
import { useToast } from '../components/ui/use-toast';
import { getProductImage } from '../shared/utils/productAssets';
import { cn } from '../lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export default function ProductDetail() {
    const { flavour } = useParams({ strict: false });
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);

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
    const unitPrice = Number(product?.price ?? 0);
    const safeUnitPrice = Number.isFinite(unitPrice) ? unitPrice : 0;
    const totalPrice = safeUnitPrice * quantity;
    const macroSummary = [
        { label: "Calories", value: nutrition?.calories !== undefined ? `${nutrition.calories} kcal` : "—" },
        { label: "Protein", value: nutrition?.protein !== undefined ? `${nutrition.protein} g` : "—" },
        { label: "Carbs", value: nutrition?.carbs !== undefined ? `${nutrition.carbs} g` : "—" },
        { label: "Fat", value: nutrition?.fat !== undefined ? `${nutrition.fat} g` : "—" },
    ];
    const ingredientsText = ingredients && ingredients.length > 0 ? ingredients.join(", ") : "No ingredients provided.";
    const benefitsList = benefits && benefits.length > 0 ? benefits : [];

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
            addToCart(product, quantity);
            toast({
                title: "Item added to cart",
                description: `${quantity} x ${product.flavour} added to your cart.`,
            });
        }
    };

    const incrementQuantity = () => setQuantity(qty => qty + 1);
    const decrementQuantity = () =>
        setQuantity(qty => (qty > 1 ? qty - 1 : 1));

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
                            ${safeUnitPrice.toFixed(2)}
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

                    <div className="pt-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                                className="rounded-sm h-10 w-10"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-xl font-bold min-w-[2ch] text-center">
                                {quantity}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={incrementQuantity}
                                className="rounded-sm h-10 w-10"
                                aria-label="Increase quantity"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <div className="ml-auto text-sm text-muted-foreground">
                                Total: ${totalPrice.toFixed(2)}
                            </div>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            size="lg"
                            variant="default"
                            className="w-full rounded-none text-lg font-bold uppercase tracking-wide py-6 text-[#1a1a1a]"
                        >
                            Add {quantity} to Cart - ${totalPrice.toFixed(2)}
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

            <section className="container grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 mt-16">
                <div className="space-y-4 bg-white border border-border shadow-sm p-8">
                    <h3 className="text-3xl font-serif font-bold text-[#1a1a1a]">Detailed Description</h3>
                    <p className="text-[#1a1a1a] leading-relaxed">
                        {product.description || "No additional description provided."}
                    </p>
                    <ul className="space-y-2 text-sm text-[#1a1a1a]">
                        <li className="flex gap-2"><span className="font-semibold">Macros:</span> {macroSummary.map(item => `${item.label}: ${item.value}`).join(" · ")}</li>
                        <li className="flex gap-2"><span className="font-semibold">Flavor:</span> {product.flavour}</li>
                        <li className="flex gap-2"><span className="font-semibold">Type:</span> {product.type || "Not specified"}</li>
                    </ul>
                </div>

                <div className="bg-white border border-border shadow-sm p-6">
                    <Accordion type="single" collapsible defaultValue="overview">
                        <AccordionItem value="overview">
                            <AccordionTrigger className="text-lg font-semibold">Overview</AccordionTrigger>
                            <AccordionContent className="text-sm text-[#1a1a1a] space-y-2">
                                <p>{product.description || "No overview available."}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="macros">
                            <AccordionTrigger className="text-lg font-semibold">Macros & Nutrition</AccordionTrigger>
                            <AccordionContent className="text-sm text-[#1a1a1a] space-y-2">
                                <ul className="space-y-1">
                                    {macroSummary.map(item => (
                                        <li key={item.label} className="flex justify-between border-b border-border/60 pb-1">
                                            <span className="font-medium">{item.label}</span>
                                            <span>{item.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="ingredients">
                            <AccordionTrigger className="text-lg font-semibold">Ingredients</AccordionTrigger>
                            <AccordionContent className="text-sm text-[#1a1a1a]">
                                {ingredientsText}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="benefits">
                            <AccordionTrigger className="text-lg font-semibold">Benefits</AccordionTrigger>
                            <AccordionContent className="text-sm text-[#1a1a1a] space-y-2">
                                {benefitsList.length === 0 ? (
                                    <p className="text-muted-foreground">No benefits provided.</p>
                                ) : (
                                    <ul className="list-disc list-inside space-y-1">
                                        {benefitsList.map(benefit => (
                                            <li key={benefit}>{benefit}</li>
                                        ))}
                                    </ul>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="usage">
                            <AccordionTrigger className="text-lg font-semibold">How to Use</AccordionTrigger>
                            <AccordionContent className="text-sm text-[#1a1a1a] space-y-2">
                                <p>Enjoy straight from the pack or as a quick post-training option.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
