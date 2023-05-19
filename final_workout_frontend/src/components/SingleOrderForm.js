import { useState } from "react";

/**
 * Component representing the form to get a single order.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setAdded - Function to set the added order.
 * @returns {JSX.Element} - Get single order form component.
 */
function GetSingleOrderForm(props) {
    const [orderID, setOrderID] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
        };

        const response = await fetch(
            "http://localhost:1339/orders/" + orderID,
            requestOptions
        );
        const result = await response.json();
        props.setAdded(result);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="orderID">Order ID</label>
            <input
                type="text"
                placeholder="Order ID"
                onChange={(e) => setOrderID(e.target.value)}
            />
            {orderID && <button type="submit">Get Order</button>}
        </form>
    );
}

export { GetSingleOrderForm };
