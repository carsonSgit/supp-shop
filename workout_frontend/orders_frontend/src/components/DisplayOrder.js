import { useState } from "react";
import Card from "./Card";

function DisplayOrder(props) {
   


    return( <div>
        <Card>
    <h1>{props.heading}</h1>
        <h2>OrderId: {props.order.orderId}</h2>
        <h2>Price: {props.order.price}</h2>
        </Card>
        

    </div>);
}
//comment

export {DisplayOrder};