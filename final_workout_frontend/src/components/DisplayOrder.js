import { useState } from "react";
import Card from "./Card";

/**
 * Component that displays the order details.
 * 
 * @param {Object} props - The props passed to the component.
 * @param {string} props.heading - The heading for the order display.
 * @param {Object} props.order - The order object to be displayed.
 * @returns {JSX.Element} - DisplayOrder component.
 */
function DisplayOrder(props) {
  return (
    <div>
      <Card>
        <h1>{props.heading}</h1>
        <h2>OrderId: {props.order.orderId}</h2>
        <h2>Price: {props.order.price}</h2>
      </Card>
    </div>
  );
}

export { DisplayOrder };
