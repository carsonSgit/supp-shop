import React from "react";
import { useState } from "react";
import { UpdateProductForm } from "./UpdateProductForm";
import { DisplaySuccess } from "./DisplaySuccess";
import { Product } from "../api/types";

/**
 * Component representing the update product page.
 *
 * @returns {JSX.Element} - Update product component.
 */
function UpdateProduct(): React.JSX.Element {
	const [updated, setUpdated] = useState<Product>({} as Product);

	return (
		<>
			<UpdateProductForm setUpdated={setUpdated} />
			<DisplaySuccess heading="Update" />
		</>
	);
}

export { UpdateProduct };

