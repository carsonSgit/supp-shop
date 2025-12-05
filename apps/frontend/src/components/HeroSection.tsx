import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Leaf, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import heroBg from '../assets/hero-bg-scenic.png';

export function HeroSection() {
    return (
        <div className="relative min-h-[90vh] w-full overflow-hidden flex items-center">
            {/* Background with Parallax-like Scale Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </motion.div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="max-w-3xl space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                        New Scenic Collection Available
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white uppercase italic"
                    >
                        Unlock Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            Natural Potential
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-gray-200 max-w-xl leading-relaxed"
                    >
                        Premium supplements sourced from the purest ingredients on Earth.
                        Experience vitality, focus, and recovery the way nature intended.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg bg-green-600 hover:bg-green-700 text-white border-0 rounded-full font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all"
                        >
                            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg border-white/30 bg-white/5 text-white hover:bg-white hover:text-black rounded-full font-bold uppercase tracking-wider backdrop-blur-sm transition-all"
                        >
                            Our Story
                        </Button>
                    </motion.div>

                    {/* Social Proof / Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="pt-8 flex items-center gap-6 text-white/80"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full bg-gray-400 border-2 border-black flex items-center justify-center text-xs font-bold text-black">
                                        {/* Placeholder avatars */}
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-400">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <span className="text-xs font-medium">10k+ Happy Athletes</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1 text-sm font-medium">
                                <Leaf className="h-4 w-4 text-green-400" /> Organic
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                <ShieldCheck className="h-4 w-4 text-blue-400" /> Lab Tested
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
