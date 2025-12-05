import React from "react";
import { useState } from "react";
import { DisplayProduct } from "./DisplayProduct";
import { GetSingleProductForm } from "./SingleProductForm";
import { Product } from "../api/types";

/**
 * A simple test component to give some example data.
 * @returns a button and display for button results.
 */
function SingleProduct(): React.JSX.Element {
	const [product, setProduct] = useState<Product>({} as Product);

	return (
		<>
			<GetSingleProductForm setFetched={setProduct} />
			<DisplayProduct product={product} heading="The found product is" />
		</>
	);
}

export { SingleProduct };

