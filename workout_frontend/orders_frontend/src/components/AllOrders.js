import { useState } from "react";
import { ListOrders } from "./ListOrders";

//comment

function AllOrders(){
    const [orders,setOrders] = useState([]);

    const callgetAllOrders = async () => {
        const response = await fetch("http://localhost:1333/orders", { method: "GET"});
        const result = await response.json();
        setOrders(result);
    };

    return (
        <div>
        <button onClick={callgetAllOrders}>Get all Orders</button>
        <ListOrders orders={orders}/>
        
        </div>
    );
}


export { AllOrders };
