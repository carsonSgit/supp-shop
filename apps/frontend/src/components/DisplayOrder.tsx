import React from "react";
import Card from "./Card";
import { DisplayOrderProps } from "../shared/types/components.types";

/**
 * Component that displays the order details.
 *
 * @param {Object} props - The props passed to the component.
 * @param {string} props.heading - The heading for the order display.
 * @param {Object} props.order - The order object to be displayed.
 * @returns {JSX.Element} - DisplayOrder component.
 */
function DisplayOrder(props: DisplayOrderProps): React.JSX.Element {
	return (
		<div>
			<Card>
				<h1>{props.heading}</h1>
				<h2>OrderId: {props.order.orderID}</h2>
				<h2>Price: {(props.order as { price?: string | number }).price}</h2>
			</Card>
		</div>
	);
}

export { DisplayOrder };

