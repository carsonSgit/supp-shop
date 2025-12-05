import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateOrder } from "../features/orders/hooks/useOrders";
import { FormWithSetAddedProps } from "../shared/types/components.types";
import { Order } from "../api/types";

/**
 * Component that lets the user enter the order ID and price to add a new order,
 * and calls the backend to add it.
 *
 * @props {function} setAdded: To pass back the added order by side-effect
 * @returns  JSX containing the form.
 */
function AddOrderForm(props: FormWithSetAddedProps<Order>): React.JSX.Element {
	const [OrderID, setOldId] = useState<string>("");
	const [Price, setNewPrice] = useState<string>("");
	const navigate = useNavigate();
	const createOrder = useCreateOrder();

	/**
	 * Handler method that makes the fetch request based on the form values.
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!OrderID || !Price) return;

		try {
			const result = await createOrder.mutateAsync({
				orderID: OrderID,
				price: Price,
			});
			props.setAdded(result);
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to create order";
			const errorStatus = (error as { status?: number }).status;
			if (errorStatus === 500) {
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

