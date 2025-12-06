import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products";
import { Button } from "../components/ui/button";
import { Loader2, Settings, ShoppingBag } from "lucide-react";
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
import { Link } from '@tanstack/react-router';

import proteinChoc from '../assets/products/protein_chocolate.png';
import proteinVanilla from '../assets/products/protein_vanilla.png';
import prePunch from '../assets/products/preworkout_punch.png';

const productImages: Record<string, string> = {
	'Chocolate': proteinChoc,
	'Vanilla': proteinVanilla,
	'Fruit Punch': prePunch
};

const defaultImage = proteinChoc;

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
		<div className="container mx-auto px-4 py-16 space-y-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
				<div className="space-y-4">
					<h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#1a1a1a]">
						Shop <span className="text-lime-500 italic">Collection</span>
					</h1>
					<p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
						Premium nutrition crafted for your journey. Pure ingredients, backed by science, designed for performance.
					</p>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" className="border-gray-200 hover:bg-lime-50 hover:text-lime-700 hover:border-lime-200 transition-all rounded-full px-6">
							<Settings className="mr-2 h-4 w-4" />
							Manage Catalog
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

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
				{/* Sidebar Filters */}
				<div className="lg:col-span-1 space-y-8">
					<div className="p-0">
						<h3 className="font-serif text-2xl mb-6">Filters</h3>
						<ShopFilters
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
							categories={categories}
						/>
					</div>
				</div>

				{/* Product Grid */}
				<div className="lg:col-span-3">
					{isLoading ? (
						<div className="flex justify-center py-32">
							<Loader2 className="h-10 w-10 animate-spin text-lime-500" />
						</div>
					) : filteredProducts.length === 0 ? (
						<div className="text-center py-32 space-y-4">
							<div className="text-muted-foreground text-lg">No products found matching your criteria.</div>
							<Button
								variant="link"
								onClick={() => { setSearchQuery(""); setSelectedCategory(null) }}
								className="text-lime-600 font-bold"
							>
								Clear Filters
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
							{filteredProducts.map((product) => {
								const imageSrc = productImages[product.flavour] || defaultImage;

								return (
									<Link
										key={product.flavour}
										to="/product/$flavour"
										params={{ flavour: product.flavour }}
										className="group flex flex-col h-full cursor-pointer"
									>
										{/* Image Container */}
										<div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center bg-[#f8f8f8] mb-6 rounded-2xl group-hover:bg-[#f0f0f0] transition-colors duration-500">
											<img
												src={imageSrc}
												alt={product.flavour}
												className="w-4/5 h-4/5 object-contain filter drop-shadow-xl transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
											/>

											{/* Hover Quick Action */}
											<div className="absolute inset-x-6 bottom-6 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
												<Button className="w-full bg-[#1a1a1a] hover:bg-lime-500 hover:text-[#1a1a1a] text-white font-bold uppercase py-6 rounded-xl shadow-xl">
													<ShoppingBag className="mr-2 h-4 w-4" /> View Details
												</Button>
											</div>
										</div>

										{/* Product Info */}
										<div className="space-y-2">
											<div className="flex justify-between items-start gap-4">
												<h3 className="font-serif text-xl text-[#1a1a1a] leading-tight group-hover:text-lime-600 transition-colors duration-300">
													{product.flavour}
												</h3>
												<span className="font-mono font-bold text-lg text-lime-600 shrink-0">
													${String(product.price)}
												</span>
											</div>
											<p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
												{product.type}
											</p>
											<p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
												{product.description || "Premium quality supplement for your daily needs."}
											</p>
										</div>
									</Link>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Products;
