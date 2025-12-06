import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Star, ShoppingBag, Leaf, Zap, Award } from "lucide-react";
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import proteinChoc from '../assets/products/protein_chocolate.png';
import proteinVanilla from '../assets/products/protein_vanilla.png';
import prePunch from '../assets/products/preworkout_punch.png';

const productImages: Record<string, string> = {
    'Chocolate': proteinChoc,
    'Vanilla': proteinVanilla,
    'Fruit Punch': prePunch
};

const defaultImage = proteinChoc;

export default function ProductDetail() {
    const { flavour } = useParams({ strict: false });

    // We fetch all products and find the one matching the flavour
    // In a real app, we'd have a getByFlavour API endpoint
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll,
    });

    const product = products?.find(p => p.flavour === flavour);
    const imageSrc = product ? (productImages[product.flavour] || defaultImage) : defaultImage;

    // Fake extra data for demo since older products don't have it in DB yet
    const nutrition = product?.nutrition || { calories: 120, protein: 24, carbs: 3, fat: 1 };
    const ingredients = product?.ingredients || ["Whey Protein Isolate", "Cocoa Powder", "Natural Flavors", "Stevia Leaf Extract", "Sea Salt"];
    const benefits = product?.benefits || ["Muscle Recovery", "Fast Absorption", "Great Taste", "Keto Friendly"];
    const rating = product?.rating || 4.9;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-lime-500" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link to="/products">
                <Button>Back to Shop</Button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Header / Nav Back */}
            <div className="container py-8">
                <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-lime-600 transition-colors">
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
                            <span className="bg-lime-100 px-3 py-1 rounded-full">{product.type}</span>
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
                                <Star className="h-4 w-4 fill-current" /> {rating}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1a1a1a] leading-tight">
                            {product.flavour}
                        </h1>
                        <p className="text-3xl font-mono font-bold text-gray-900">
                            ${String(product.price)}
                        </p>
                    </div>

                    <p className="text-gray-500 text-lg leading-relaxed">
                        {product.description || "Premium quality supplement crafted for peak performance. Featuring ultra-pure ingredients and rapid absorption technology."}
                    </p>

                    {/* Quick Benefits (Flat) */}
                    <div className="grid grid-cols-2 gap-4">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-transparent">
                                <Award className="h-5 w-5 text-lime-500" />
                                <span className="font-bold text-gray-700 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <Button className="flex-1 h-14 bg-[#1a1a1a] hover:bg-lime-500 hover:text-[#1a1a1a] text-lg font-bold uppercase tracking-wide rounded-xl shadow-none hover:shadow-lg transition-all">
                            Add to Cart - ${String(product.price)}
                        </Button>
                    </div>

                    {/* Nutrition Accordion Style (Flat) */}
                    <div className="space-y-6 pt-8 border-t border-gray-100">
                        <h3 className="font-serif font-bold text-2xl">Nutrition Facts</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-transparent border-r border-gray-200 last:border-0">
                                <div className="text-2xl font-bold text-[#1a1a1a]">{nutrition.calories}</div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Cals</div>
                            </div>
                            <div className="p-4 bg-transparent border-r border-gray-200 last:border-0">
                                <div className="text-2xl font-bold text-[#1a1a1a]">{nutrition.protein}g</div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Prot</div>
                            </div>
                            <div className="p-4 bg-transparent border-r border-gray-200 last:border-0">
                                <div className="text-2xl font-bold text-[#1a1a1a]">{nutrition.carbs}g</div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Carbs</div>
                            </div>
                            <div className="p-4 bg-transparent">
                                <div className="text-2xl font-bold text-[#1a1a1a]">{nutrition.fat}g</div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Fat</div>
                            </div>
                        </div>

                        <div className="bg-transparent pt-4">
                            <h4 className="font-bold uppercase text-sm text-gray-400 mb-3">Ingredients</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {ingredients.join(", ")}
                            </p>
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
