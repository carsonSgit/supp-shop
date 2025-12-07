import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products";
import { Product } from "../api/types";
import { Button } from "../components/ui/button";
import { Loader2, RefreshCcw, Settings, ShoppingBag } from "lucide-react";
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
import { useCart } from "../features/cart/context/CartContext";
import { useToast } from "../components/ui/use-toast";
import { ProductSkeletonGrid } from "../components/ProductSkeletonGrid";
import { getProductImage } from "../shared/utils/productAssets";
import { cn } from "../lib/utils";

function Products(): React.JSX.Element {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const { addToCart } = useCart();
	const { toast } = useToast();

	const { data: products, isLoading, isError, error, refetch, isFetching } = useQuery({
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

	const handleAddToCart = (product: Product) => {
		addToCart(product, 1);
		toast({
			title: "Added to cart",
			description: `${product.flavour} has been added to your cart.`,
		});
	};

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
						<ProductSkeletonGrid />
					) : isError ? (
						<div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
							<p className="text-lg font-semibold text-foreground">We couldn't load the catalog</p>
							<p className="text-muted-foreground">{error instanceof Error ? error.message : "Please check your connection and try again."}</p>
							<div className="flex gap-3">
								<Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
									<RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
									Retry
								</Button>
								<Button variant="ghost" onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>
									Clear filters
								</Button>
							</div>
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
								const imageSrc = getProductImage(product.flavour);

								return (
									<Link
										key={product.flavour}
										to="/product/$flavour"
										params={{ flavour: product.flavour }}
										className="group flex flex-col h-full cursor-pointer"
									>
										{/* Hero Card */}
										<div className="relative bg-[#ededed] overflow-hidden flex items-center justify-center shadow-[0_18px_36px_rgba(0,0,0,0.08)] aspect-[3/4]">
											<img
												src={imageSrc}
												alt={product.flavour}
												className="h-full w-full object-cover"
											/>
											<div className="absolute inset-0 bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
										</div>

										{/* Product Info */}
										<div className="pt-6 space-y-1 text-[#1a1a1a]">
											<p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-800">
												{product.type || "Featured Product"}
											</p>
											<h3 className="text-xl font-extrabold leading-snug">
												{product.flavour}
											</h3>
											<p className="text-[11px] uppercase tracking-[0.18em] text-gray-600">
												{product.type ? `${product.type}` : "Signature Series"}
												{product.flavour ? ` • ${product.flavour}` : ""}
											</p>
											<div className="pt-3 flex items-center justify-between gap-4">
												<div className="text-lg font-black shrink-0">
													${Number(product.price || 0).toFixed(2)}
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="text-[#1a1a1a] hover:bg-black/5 rounded-none uppercase font-semibold tracking-wide px-5"
													onClick={(e) => {
														e.preventDefault();
														handleAddToCart(product);
													}}
												>
													<ShoppingBag className="mr-2 h-4 w-4" />
													Add to Cart
												</Button>
											</div>
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
