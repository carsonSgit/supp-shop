import { ListOrders } from "./ListOrders";
import { useOrders } from "../features/orders/hooks/useOrders";

/**
 * Component that fetches and displays all orders.
 *
 * @returns  JSX containing the button to fetch all orders and the list of orders.
 */
function AllOrders() {
	const { data: orders = [], refetch, isLoading, error } = useOrders();

	/**
	 * Function that makes the fetch request to get all orders.
	 */
	const callgetAllOrders = () => {
		refetch();
	};

	if (error) {
		return <div>Error loading orders: {error.message}</div>;
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
