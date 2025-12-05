import React from "react";
import { Order } from "../api/types";

interface ListOrdersProps {
	orders?: Order[];
}

function ListOrders({ orders }: ListOrdersProps): React.JSX.Element {
	return (
		<>
			<h1>All Orders</h1>
			<ul>
				{orders?.map((order) => (
					<li key={order.orderID}>
						{order.orderID} with price {(order as { price?: string | number }).price}
					</li>
				))}
			</ul>
		</>
	);
}

export { ListOrders };

