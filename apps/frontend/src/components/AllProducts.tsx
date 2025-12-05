import React from "react";
import { ListProducts } from "./ListProducts";
import { useProducts } from "../features/products/hooks/useProducts";

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
		const errorMessage = error instanceof Error 
			? error.message 
			: 'Unknown error occurred';
		return (
			<div style={{ color: 'red', padding: '10px' }}>
				<p>Error loading products: {errorMessage}</p>
				<button onClick={() => refetch()}>Retry</button>
			</div>
		);
	}

	return (
		<>
			<ListProducts products={products} />
			<button onClick={callGetAllProducts} disabled={isLoading}>
				{isLoading ? "Loading..." : "Get All Products"}
			</button>
		</>
	);
}

export { AllProducts };

