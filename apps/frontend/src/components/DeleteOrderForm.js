import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteOrder } from "../features/orders/hooks/useOrders";

/**
 * Component representing the form for deleting an order.
 *
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.setAdded - Function to set the added order.
 * @returns {JSX.Element} - DeleteOrderForm component.
 */
function DeleteOrderForm(props) {
	const [OrderID, setId] = useState(null);

	const navigate = useNavigate();
	const deleteOrder = useDeleteOrder();

	/**
	 * Handler method that makes the delete request based on the form values.
	 * @param {Object} event - The event object.
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await deleteOrder.mutateAsync(OrderID);
			props.setAdded({ orderID: OrderID });
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to delete order";
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
