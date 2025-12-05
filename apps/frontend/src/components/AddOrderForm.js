import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateOrder } from "../features/orders/hooks/useOrders";

/**
 * Component that lets the user enter the order ID and price to add a new order,
 * and calls the backend to add it.
 *
 * @props {function} setAdded: To pass back the added order by side-effect
 * @returns  JSX containing the form.
 */
function AddOrderForm(props) {
	const [OrderID, setOldId] = useState(null);
	const [Price, setNewPrice] = useState(null);
	const navigate = useNavigate();
	const createOrder = useCreateOrder();

	/**
	 * Handler method that makes the fetch request based on the form values.
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const result = await createOrder.mutateAsync({
				orderID: OrderID,
				price: Price,
			});
			props.setAdded(result);
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to create order";
			if (error.status === 500) {
				navigate({
					to: "/systemerror",
					search: { errorMessage },
				});
			} else {
				navigate({
					to: "/",
					search: { errorMessage },
				});
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="OrderID">Order Id</label>
			<input
				type="text"
				placeholder="Order Id"
				onChange={(e) => setOldId(e.target.value)}
			/>
			<label htmlFor="Price">New Price</label>
			<input
				type="text"
				placeholder="New Price"
				onChange={(e) => setNewPrice(e.target.value)}
			/>
			{OrderID && Price && <button type="submit">New Order</button>}
		</form>
	);
}

export { AddOrderForm };
