import React from "react";
import { useState } from "react";
import { AddProductForm } from "./AddProductForm";
import { DisplayProduct } from "./DisplayProduct";
import { Product } from "../api/types";

/**
 * Simple component that renders displays.
 * @returns a user-input field and a display-card for the added product.
 */
function AddProduct(): React.JSX.Element {
	const [added, setAdded] = useState<Product>({} as Product);

	return (
		<>
			<AddProductForm setAdded={setAdded} />
			<DisplayProduct product={added} heading="The added product" />
		</>
	);
}

export { AddProduct };

