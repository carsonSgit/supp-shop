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
		<div className="space-y-8">
			<GetSingleProductForm setFetched={setProduct} />
			{(product.flavour || product.price) && (
				<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
					<Separator className="my-8" />
					<DisplayProduct product={product} heading="Product Found" />
				</div>
			)}
		</div>
	);
}

export { SingleProduct };
