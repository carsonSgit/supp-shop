import React from "react";
import { useState } from "react";
import { DeleteProductForm } from "./DeleteProductForm";
import { DisplaySuccess } from "./DisplaySuccess";
import { Product } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Component that handles the process of deleting a product.
 *
 * @returns  JSX containing the delete product form and the display of the success message.
 */
function DeleteProduct(): React.JSX.Element {
	const [deleted, setDeleted] = useState<Product>({} as Product);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Delete Product</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<DeleteProductForm setDeleted={setDeleted} />
					{deleted.flavour && (
						<>
							<Separator />
							<DisplaySuccess heading="Product deleted successfully" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { DeleteProduct };
