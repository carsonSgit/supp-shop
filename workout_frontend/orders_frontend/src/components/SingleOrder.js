import { useState } from "react";
import { DisplayOrder } from "./DisplayOrder";

function GetSingleOrder() {
    const [order, setOrder] = useState({});
    const callGetOrder = async () =>
    {
        const response = await fetch("http://localhost:1333/orders/7", {method: "GET"});
        const result = await response.json();
        setOrder(result);
    }


    return( <div>
        
        <button onClick={callGetOrder}>Find order number 7</button>
        <DisplayOrder order={order} heading="The found order is"/>

    </div>);
}

export { GetSingleOrder };