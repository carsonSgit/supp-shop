import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteProduct } from "../features/products/hooks/useProducts";

/**
 * Functionality for deleting a product according to given parameters.
 * Uses a DELETE request to update the product in the database.
 * @param {Object} props: the parameter of the product to be deleting.
 * @returns user-input field that holds a value for the product.
 */
function DeleteProductForm(props) {
	const [oldFlavour, setOldFlavour] = useState(null);

	const navigate = useNavigate();
	const deleteProduct = useDeleteProduct();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await deleteProduct.mutateAsync({
				flavour: oldFlavour,
			});
			props.setDeleted({ flavour: oldFlavour });
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to delete product";
			navigate({ 
				to: "/", 
				search: { errorMessage } 
			});
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="oldFlavour">Delete flavour:</label>
			<input
				type="text"
				placeholder="Current Flavour..."
				onChange={(e) => setOldFlavour(e.target.value)}
			/>
			{oldFlavour && <button type="submit">Delete Product</button>}
		</form>
	);
}

export { DeleteProductForm };
