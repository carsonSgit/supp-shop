import { useState } from "react";
import { ListOrders } from "./ListOrders";

/**
 * Component that fetches and displays all orders.
 * 
 * @returns  JSX containing the button to fetch all orders and the list of orders.
 */
function AllOrders() {
    const [orders, setOrders] = useState([]);

    /**
     * Function that makes the fetch request to get all orders.
     */
    const callgetAllOrders = async () => {
        const response = await fetch("http://localhost:1339/orders", { method: "GET" });
        const result = await response.json();
        setOrders(result);
    };

    return (
        <div>
            <button onClick={callgetAllOrders}>Get all Orders</button>
            <ListOrders orders={orders} />
        </div>
    );
}

export { AllOrders };
