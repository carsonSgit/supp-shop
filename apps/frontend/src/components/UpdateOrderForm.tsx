import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateOrder } from "../features/orders/hooks/useOrders";
import { FormWithSetUpdatedProps } from "../shared/types/components.types";
import { Order } from "../api/types";

/**
 * Component representing the update order form.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.setUpdated - Callback function to set the updated order.
 * @returns {JSX.Element} - Update order form component.
 */
function UpdateOrderForm(props: FormWithSetUpdatedProps<Order>): React.JSX.Element {
	const [oldOrderID, setOldId] = useState<string>("");
	const [newPrice, setNewPrice] = useState<string>("");

	const navigate = useNavigate();
	const updateOrder = useUpdateOrder();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!oldOrderID || !newPrice) return;

		try {
			const result = await updateOrder.mutateAsync({
				orderID: oldOrderID,
				order: { price: newPrice },
			});
			props.setUpdated(result);
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to update order";
			navigate({ 
				to: "/", 
				search: { errorMessage } 
			});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="oldOrderID">Current Order Id</label>
			<input
				type="text"
				placeholder="Current Order Id"
				onChange={(e) => setOldId(e.target.value)}
			/>
			<label htmlFor="oldOrderID">New Price</label>
			<input
				type="text"
				placeholder="New Price"
				onChange={(e) => setNewPrice(e.target.value)}
			/>
			{oldOrderID && newPrice && <button type="submit">Update Order</button>}
		</form>
	);
}

export { UpdateOrderForm };

