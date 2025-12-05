import { useState } from "react";
import { UpdateProductForm } from "./UpdateProductForm";
import { DisplaySuccess } from "./DisplaySuccess";

/**
 * Component representing the update product page.
 *
 * @returns {JSX.Element} - Update product component.
 */
function UpdateProduct() {
	const [updated, setUpdated] = useState({});

	return (
		<>
			<UpdateProductForm setUpdated={setUpdated} />
			<DisplaySuccess product={updated} heading="Update" />
		</>
	);
}

export { UpdateProduct };
