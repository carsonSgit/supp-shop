import React from "react";
import { Product } from "../api/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../features/cart/context/CartContext";
import { useToast } from "./ui/use-toast";
import { Link } from "@tanstack/react-router";

interface ListProductsProps {
	products: Product[];
}

/**
 * Simple component to display a list of products.
 * @param {Object Array} products: the array of products in the database.
 * @returns a list of all products sorted by id.
 */
function ListProducts({ products }: ListProductsProps): React.JSX.Element {
	const { addToCart } = useCart();
	const { toast } = useToast();

	const handleAddToCart = (product: Product) => {
		addToCart(product, 1);
		toast({
			title: "Item added to cart",
			description: `${product.flavour} has been added to your cart.`,
		});
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">All Products</h1>
			{products.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No products available</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => {
						const productId = (product as { _id?: string })._id;
						const description = (product as { description?: string })
							.description || "";
						return (
							<Card
								key={productId}
								className="flex flex-col hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<CardTitle className="text-lg">{product.flavour}</CardTitle>
										<Badge variant="secondary">{product.type || "N/A"}</Badge>
									</div>
									<CardDescription className="line-clamp-2">
										{description || "No description available"}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-1">
									<div className="flex items-baseline space-x-2">
										<span className="text-2xl font-bold text-primary">
											${String(product.price)}
										</span>
									</div>
								</CardContent>
								<CardFooter className="flex gap-2">
									<Button
										className="flex-1"
										variant="default"
										onClick={() => handleAddToCart(product)}
									>
										<ShoppingCart className="mr-2 h-4 w-4" />
										Add to Cart
									</Button>
									<Link to="/product/$flavour" params={{ flavour: product.flavour }} className="flex-1">
										<Button variant="outline" className="w-full">
											View Details
										</Button>
									</Link>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

export { ListProducts };
