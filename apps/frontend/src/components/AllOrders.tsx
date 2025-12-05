import React from "react";
import { ListOrders } from "./ListOrders";
import { useOrders } from "../features/orders/hooks/useOrders";

/**
 * Component that fetches and displays all orders.
 *
 * @returns  JSX containing the button to fetch all orders and the list of orders.
 */
function AllOrders(): React.JSX.Element {
	const { data: orders = [], refetch, isLoading, error } = useOrders();

	/**
	 * Function that makes the fetch request to get all orders.
	 */
	const callgetAllOrders = (): void => {
		refetch();
	};

	if (error) {
		const errorMessage = error instanceof Error 
			? error.message 
			: 'Unknown error occurred';
		return (
			<div style={{ color: 'red', padding: '10px' }}>
				<p>Error loading orders: {errorMessage}</p>
				<button onClick={() => refetch()}>Retry</button>
			</div>
		);
	}

	return (
		<div>
			<button onClick={callgetAllOrders} disabled={isLoading}>
				{isLoading ? "Loading..." : "Get all Orders"}
			</button>
			<ListOrders orders={orders} />
		</div>
	);
}

export { AllOrders };

