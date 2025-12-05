import React from "react";
import { useState } from "react";
import { AddProductForm } from "./AddProductForm";
import { DisplayProduct } from "./DisplayProduct";
import { Product } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Simple component that renders displays.
 * @returns a user-input field and a display-card for the added product.
 */
function AddProduct(): React.JSX.Element {
	const [added, setAdded] = useState<Product>({} as Product);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New Product</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<AddProductForm setAdded={setAdded} />
					{(added.flavour || added.price) && (
						<>
							<Separator />
							<DisplayProduct product={added} heading="The added product" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { AddProduct };
