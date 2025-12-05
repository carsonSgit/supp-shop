import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Loader2, Settings } from "lucide-react";
import { ShopFilters } from "../components/ShopFilters";
import ProductMenu from "../components/ProductMenu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/ui/dialog";

function Products(): React.JSX.Element {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const { data: products, isLoading } = useQuery({
		queryKey: ['products'],
		queryFn: productsApi.getAll,
	});

	const categories = useMemo(() => {
		if (!products) return [];
		const types = new Set(products.map(p => p.type).filter((t): t is string => !!t));
		return Array.from(types);
	}, [products]);

	const filteredProducts = useMemo(() => {
		if (!products) return [];
		return products.filter(product => {
			const matchesSearch =
				product.flavour.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory ? product.type === selectedCategory : true;
			return matchesSearch && matchesCategory;
		});
	}, [products, searchQuery, selectedCategory]);

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-4xl font-bold tracking-tight text-foreground">Shop Supplements</h1>
					<p className="text-muted-foreground mt-2">Premium nutrition for your journey.</p>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<Settings className="mr-2 h-4 w-4" />
							Manage Products
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Product Management</DialogTitle>
							<DialogDescription>
								Add, update, or remove products from the catalog.
							</DialogDescription>
						</DialogHeader>
						<ProductMenu />
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle>Filters</CardTitle>
						</CardHeader>
						<CardContent>
							<ShopFilters
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								selectedCategory={selectedCategory}
								setSelectedCategory={setSelectedCategory}
								categories={categories}
							/>
						</CardContent>
					</Card>
				</div>

				<div className="lg:col-span-3">
					{isLoading ? (
						<div className="flex justify-center py-20">
							<Loader2 className="h-10 w-10 animate-spin text-primary" />
						</div>
					) : filteredProducts.length === 0 ? (
						<div className="text-center py-20 text-muted-foreground">
							No products found matching your criteria.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredProducts.map((product) => (
								<Card key={product.flavour} className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col">
									<div className="aspect-square bg-secondary/10 relative overflow-hidden flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
										<div className="text-muted-foreground/20 text-5xl font-black uppercase rotate-[-15deg] select-none">
											{(product.type || 'Item').split(' ')[0]}
										</div>
										<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-40" />
										<div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
											<Button className="w-full font-bold uppercase bg-white text-primary hover:bg-primary hover:text-white shadow-md">
												Add to Cart
											</Button>
										</div>
									</div>
									<CardHeader className="p-4 pb-0">
										<div className="flex justify-between items-start mb-2">
											<Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 backdrop-blur-sm text-xs">{product.type}</Badge>
											<span className="font-bold text-lg font-mono text-primary">${String(product.price)}</span>
										</div>
										<CardTitle className="text-xl uppercase italic tracking-wide text-foreground line-clamp-1" title={product.flavour}>
											{product.flavour}
										</CardTitle>
									</CardHeader>
									<CardContent className="p-4 pt-2 flex-grow">
										<p className="text-sm text-muted-foreground line-clamp-2">
											{product.description || "Premium quality supplement for your daily needs."}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Products;
