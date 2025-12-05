import { useState, useEffect } from "react";
import { useOrder } from "../features/orders/hooks/useOrders";

/**
 * Component representing the form to get a single order.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setAdded - Function to set the added order.
 * @returns {JSX.Element} - Get single order form component.
 */
function GetSingleOrderForm(props) {
	const [orderID, setOrderID] = useState("");
	const [submittedOrderID, setSubmittedOrderID] = useState("");
	const { data, isLoading, error } = useOrder(submittedOrderID);

	useEffect(() => {
		if (data) {
			props.setAdded(data);
		}
	}, [data, props]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (orderID) {
			setSubmittedOrderID(orderID);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="orderID">Order ID</label>
			<input
				type="text"
				placeholder="Order ID"
				value={orderID}
				onChange={(e) => setOrderID(e.target.value)}
			/>
			{orderID && (
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Loading..." : "Get Order"}
				</button>
			)}
			{error && <div style={{ color: "red" }}>Error: {error.message}</div>}
		</form>
	);
}

export { GetSingleOrderForm };
