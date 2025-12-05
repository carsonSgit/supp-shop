import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateOrder } from "../features/orders/hooks/useOrders";

/**
 * Component representing the update order form.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.setUpdated - Callback function to set the updated order.
 * @returns {JSX.Element} - Update order form component.
 */
function UpdateOrderForm(props) {
	const [oldOrderID, setOldId] = useState(null);
	const [newPrice, setNewPrice] = useState(null);

	const navigate = useNavigate();
	const updateOrder = useUpdateOrder();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const result = await updateOrder.mutateAsync({
				orderID: oldOrderID,
				order: { price: newPrice },
			});
			props.setUpdated(result);
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to update order";
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
