import React from "react";
import { DisplayOrderProps } from "../shared/types/components.types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

/**
 * Component that displays the order details.
 *
 * @param {Object} props - The props passed to the component.
 * @param {string} props.heading - The heading for the order display.
 * @param {Object} props.order - The order object to be displayed.
 * @returns {JSX.Element} - DisplayOrder component.
 */
function DisplayOrder(props: DisplayOrderProps): React.JSX.Element {
	const price = (props.order as { price?: string | number }).price;

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl">{props.heading}</CardTitle>
				<CardDescription>Order details and information</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Separator />
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-muted-foreground">
							Order ID:
						</span>
						<Badge variant="outline" className="text-lg">
							{props.order.orderID}
						</Badge>
					</div>
					{props.order.username && (
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">
								Username:
							</span>
							<span className="text-lg">{props.order.username}</span>
						</div>
					)}
					{props.order.flavour && (
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">
								Product:
							</span>
							<span className="text-lg">{props.order.flavour}</span>
						</div>
					)}
					{props.order.quantity && (
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">
								Quantity:
							</span>
							<span className="text-lg">{props.order.quantity}</span>
						</div>
					)}
					{price && (
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">
								Price:
							</span>
							<span className="text-2xl font-bold text-primary">
								${price}
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export { DisplayOrder };
