import React from "react";
import { useState } from "react";
import { UpdateProductForm } from "./UpdateProductForm";
import { DisplaySuccess } from "./DisplaySuccess";
import { Product } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Component representing the update product page.
 *
 * @returns {JSX.Element} - Update product component.
 */
function UpdateProduct(): React.JSX.Element {
	const [updated, setUpdated] = useState<Product>({} as Product);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Update Product</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<UpdateProductForm setUpdated={setUpdated} />
					{(updated.flavour || updated.price) && (
						<>
							<Separator />
							<DisplaySuccess heading="Product updated successfully" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { UpdateProduct };
