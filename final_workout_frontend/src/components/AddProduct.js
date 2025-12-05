import { useState } from "react";
import { AddProductForm } from "./AddProductForm";
import { DisplayProduct } from "./DisplayProduct";

/**
 * Simple component that renders displays.
 * @returns a user-input field and a display-card for the added product.
 */
function AddProduct() {
	const [added, setAdded] = useState({});

	return (
		<>
			<AddProductForm setAdded={setAdded} />
			<DisplayProduct product={added} heading="The added product" />
		</>
	);
}

export { AddProduct };
