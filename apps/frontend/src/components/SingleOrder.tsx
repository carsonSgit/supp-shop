import React from "react";
import { useState } from "react";
import { GetSingleOrderForm } from "./SingleOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Component representing the single order page.
 *
 * @returns {JSX.Element} - Single order component.
 */
function SingleOrder(): React.JSX.Element {
	const [added, setAdded] = useState<Order>({} as Order);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Find Order</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<GetSingleOrderForm setFetched={setAdded} />
					{(added.orderID || (added as { price?: string | number }).price) && (
						<>
							<Separator />
							<DisplayOrder order={added} heading="The found order is: " />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { SingleOrder };
