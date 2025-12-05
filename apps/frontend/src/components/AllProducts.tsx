import React from "react";
import { ListProducts } from "./ListProducts";
import { useProducts } from "../features/products/hooks/useProducts";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * Simple component that utilizes a button that when clicked calls a
 *  GET request on all products.
 * @returns a button that will display all products.
 */
function AllProducts(): React.JSX.Element {
	const { data: products = [], refetch, isLoading, error } = useProducts();

	const callGetAllProducts = (): void => {
		refetch();
	};

	if (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return (
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Error Loading Products</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
					<Button onClick={() => refetch()} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Products</CardTitle>
						<Button onClick={callGetAllProducts} disabled={isLoading}>
							<RefreshCw
								className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
							/>
							{isLoading ? "Loading..." : "Refresh Products"}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ListProducts products={products} />
				</CardContent>
			</Card>
		</div>
	);
}

export { AllProducts };
