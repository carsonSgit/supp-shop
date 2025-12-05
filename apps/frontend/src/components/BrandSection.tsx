import React from 'react';
import { Leaf, Droplets, Mountain } from 'lucide-react';

export function BrandSection() {
    return (
        <section className="py-24 bg-secondary/10">
            <div className="container">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground">Powered by <span className="text-primary">Nature</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        We believe in the power of natural ingredients to fuel your body and mind.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Leaf className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold uppercase text-foreground">100% Organic</h3>
                        <p className="text-muted-foreground">
                            Sourced from the finest organic farms, ensuring no pesticides or harmful chemicals.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Droplets className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold uppercase text-foreground">Pure Extraction</h3>
                        <p className="text-muted-foreground">
                            Advanced cold-press technology preserves the natural potency of every ingredient.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Mountain className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold uppercase text-foreground">Peak Performance</h3>
                        <p className="text-muted-foreground">
                            Designed to help you reach new heights, naturally and sustainably.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
