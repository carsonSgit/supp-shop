import React from "react";
import { useState } from "react";
import { DisplayProduct } from "./DisplayProduct";
import { GetSingleProductForm } from "./SingleProductForm";
import { Product } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * A simple test component to give some example data.
 * @returns a button and display for button results.
 */
function SingleProduct(): React.JSX.Element {
	const [product, setProduct] = useState<Product>({} as Product);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Find Product</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<GetSingleProductForm setFetched={setProduct} />
					{(product.flavour || product.price) && (
						<>
							<Separator />
							<DisplayProduct product={product} heading="The found product is" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { SingleProduct };
