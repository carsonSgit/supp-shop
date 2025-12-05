import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteOrder } from "../features/orders/hooks/useOrders";
import { FormWithSetAddedProps } from "../shared/types/components.types";
import { Order } from "../api/types";

/**
 * Component representing the form for deleting an order.
 *
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.setAdded - Function to set the added order.
 * @returns {JSX.Element} - DeleteOrderForm component.
 */
function DeleteOrderForm(props: FormWithSetAddedProps<Order>): React.JSX.Element {
	const [OrderID, setId] = useState<string>("");

	const navigate = useNavigate();
	const deleteOrder = useDeleteOrder();

	/**
	 * Handler method that makes the delete request based on the form values.
	 * @param {Object} event - The event object.
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!OrderID) return;

		try {
			await deleteOrder.mutateAsync(OrderID);
			props.setAdded({ orderID: OrderID, username: "", flavour: "", quantity: 0 });
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to delete order";
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
				onChange={(e) => setId(e.target.value)}
			/>
			{OrderID && <button type="submit">Delete Order</button>}
		</form>
	);
}

export { DeleteOrderForm };

