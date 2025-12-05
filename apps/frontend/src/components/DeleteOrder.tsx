import React from "react";
import { useState } from "react";
import { DeleteOrderForm } from "./DeleteOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

function DeleteOrder(): React.JSX.Element {
	const [added, setAdded] = useState<Order>({} as Order);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Delete Order</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<DeleteOrderForm setAdded={setAdded} />
					{(added.orderID || (added as { price?: string | number }).price) && (
						<>
							<Separator />
							<DisplayOrder order={added} heading="The deleted order is: " />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { DeleteOrder };
