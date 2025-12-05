import React from "react";
import { useState } from "react";
import { DeleteProductForm } from "./DeleteProductForm";
import { DisplaySuccess } from "./DisplaySuccess";
import { Product } from "../api/types";

/**
 * Component that handles the process of deleting a product.
 *
 * @returns  JSX containing the delete product form and the display of the success message.
 */
function DeleteProduct(): React.JSX.Element {
	const [deleted, setDeleted] = useState<Product>({} as Product);

	return (
		<>
			<DeleteProductForm setDeleted={setDeleted} />
			<DisplaySuccess heading="Delete" />
		</>
	);
}

export { DeleteProduct };

