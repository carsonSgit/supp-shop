import React from "react";
import { DisplayProductProps } from "../shared/types/components.types";
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
 * Component to display a given product information
 * @param {Object} product: Product to display containing flavour, type, and price
 * @param {string} heading: String describing the product to display
 * @returns a display object holding the product information
 */
function DisplayProduct(props: DisplayProductProps): React.JSX.Element {
	const description = (props.product as { description?: string }).description || "";

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-start justify-between">
					<CardTitle className="text-2xl">{props.heading}</CardTitle>
					{props.product.type && (
						<Badge variant="secondary">{props.product.type}</Badge>
					)}
				</div>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-4">
				<Separator />
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-muted-foreground">
							Flavour:
						</span>
						<span className="text-lg font-semibold">
							{props.product.flavour}
						</span>
					</div>
					{props.product.type && (
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">
								Type:
							</span>
							<span className="text-lg">{props.product.type}</span>
						</div>
					)}
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-muted-foreground">
							Price:
						</span>
						<span className="text-2xl font-bold text-primary">
							${String(props.product.price)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { DisplayProduct };
