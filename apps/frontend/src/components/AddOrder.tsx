import React from "react";
import { useState } from "react";
import { AddOrderForm } from "./AddOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Component that handles the process of adding an order.
 *
 * @returns  JSX containing the add order form and the display of the added order.
 */
function AddOrder(): React.JSX.Element {
	const [added, setAdded] = useState<Order>({} as Order);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New Order</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<AddOrderForm setAdded={setAdded} />
					{(added.orderID || (added as { price?: string | number }).price) && (
						<>
							<Separator />
							<DisplayOrder order={added} heading="The added order is: " />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { AddOrder };
