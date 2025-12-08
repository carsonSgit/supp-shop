import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

// Import local assets
// Note: In a real app these might be dynamic, but for the hero collage we use specific ones
import heroProduct from "../assets/products/protein_chocolate.png";

export function HeroSection() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const rotate = useTransform(scrollY, [0, 500], [0, 10]);

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#fafafa] flex flex-col justify-center">

            <div className="container relative z-10 px-2 md:px-4">
                {/* Top Navigation / Brand element could go here if header isn't fixed */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* Left Content - Text */}
                    <div className="lg:col-span-5 relative z-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl md:text-8xl font-serif text-[#1a1a1a] tracking-tight leading-[0.9]"
                        >
                            Supplements <br />
                            crafted to <br />
                            move with <br />
                            <span className="relative inline-block">
                                your
                                <motion.svg
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute -bottom-2 left-0 w-full h-3 text-lime-400 -z-10"
                                    viewBox="0 0 100 10"
                                    preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </motion.svg>
                            </span> story
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex items-center gap-4"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                                <div className="h-12 w-12 rounded-full border-2 border-white bg-black text-white flex items-center justify-center text-xs font-bold">
                                    2k+
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-600 max-w-[150px] leading-tight">
                                Athletes trust our clean formulas.
                            </div>
                        </motion.div>
                    </div>

                    {/* Center/Right Content - Collage Image */}
                    <div className="lg:col-span-7 relative h-[600px] md:h-[800px] w-full flex items-center justify-center">

                        {/* Floating Elements (Stickers, Arrows, etc) */}

                        {/* Interactive Badge */}
                        <motion.div
                            style={{ y: y2 }}
                            className="absolute top-[10%] left-[10%] z-10 cursor-pointer"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="h-24 w-24 rounded-full bg-white border-2 border-lime-400 shadow-xl flex items-center justify-center transform -rotate-12">
                                <span className="font-serif text-xs font-bold uppercase text-center leading-tight tracking-wider">
                                    Certified<br />Clean
                                </span>
                            </div>
                        </motion.div>

                        {/* Main Hero Image Frame */}
                        <motion.div
                            style={{ y: y1 }}
                            className="relative z-10 w-[80%] max-w-md cursor-pointer"
                            whileHover={{ scale: 1.02, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {/* Polaroid Frame */}
                            <div className="bg-white p-4 pb-16 shadow-2xl transform rotate-2 border border-gray-100">
                                <div className="bg-gray-100 aspect-[4/5] overflow-hidden relative">
                                    <img
                                        src={heroProduct}
                                        alt="Chocolate Protein"
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Tag on image */}
                                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-white/50">
                                        Whey Isolate
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center font-handwriting text-2xl text-gray-600 font-serif italic">
                                    Daily Essentials
                                </div>
                            </div>

                            {/* Floating Product Tag */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -right-8 top-1/2 bg-[#fafafa] border border-gray-200 p-2 shadow-lg max-w-[150px] rotate-6"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] uppercase font-bold text-gray-500">In Stock</span>
                                </div>
                                <p className="font-serif text-sm leading-tight">
                                    Chocolate Fudge Brownie <br />
                                    <span className="bg-lime-300 px-1">100% Grass Fed</span>
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Number decoration */}
                        <div className="absolute bottom-0 right-10 text-[12rem] font-serif leading-none text-gray-100 -z-10 select-none">
                            (01)
                        </div>
                    </div>

                    {/* Bottom Links/Product Previews */}
                    <div className="absolute bottom-10 left-10 hidden lg:block">
                        <div className="flex gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 0, y: -5 }}
                                className="w-24 h-32 bg-white border border-gray-200 p-2 shadow-sm transform -rotate-3 cursor-pointer"
                            >
                                <div className="w-full h-20 bg-gray-50 mb-2"></div>
                                <div className="text-[10px] text-center uppercase tracking-wider text-gray-500">(02) Vanilla</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 0, y: -5 }}
                                className="w-24 h-32 bg-white border border-gray-200 p-2 shadow-sm transform rotate-3 cursor-pointer"
                            >
                                <div className="w-full h-20 bg-gray-50 mb-2"></div>
                                <div className="text-[10px] text-center uppercase tracking-wider text-gray-500">(03) Pre</div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

