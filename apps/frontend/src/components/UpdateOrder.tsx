import React from "react";
import { useState } from "react";
import { UpdateOrderForm } from "./UpdateOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

function UpdateOrder(): React.JSX.Element {
	const [updated, setUpdated] = useState<Order>({} as Order);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Update Order</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<UpdateOrderForm setUpdated={setUpdated} />
					{(updated.orderID || (updated as { price?: string | number }).price) && (
						<>
							<Separator />
							<DisplayOrder order={updated} heading="The updated order is" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { UpdateOrder };
