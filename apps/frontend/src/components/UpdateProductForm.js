import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateProduct } from "../features/products/hooks/useProducts";

/**
 * Functionality for updating a product according to given parameters.
 * Uses a PUT request to update the product in the database.
 * @param {Object} props: the parameters of the product to be updated.
 * @returns user-input fields that hold values for the product.
 */
function UpdateProductForm(props) {
	const [oldFlavour, setOldFlavour] = useState(null);
	const [oldType, setOldType] = useState(null);
	const [oldPrice, setOldPrice] = useState(null);
	const [newPrice, setNewPrice] = useState(null);

	const navigate = useNavigate();
	const updateProduct = useUpdateProduct();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const result = await updateProduct.mutateAsync({
				flavour: oldFlavour,
				type: oldType,
				price: oldPrice,
				updatePrice: newPrice,
			});
			props.setUpdated(result);
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to update product";
			navigate({ 
				to: "/", 
				search: { errorMessage } 
			});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="oldFlavour">Current flavour:</label>
			<input
				type="text"
				placeholder="Current Flavour..."
				onChange={(e) => setOldFlavour(e.target.value)}
			/>
			<label htmlFor="oldType">Current type:</label>
			<input
				type="text"
				placeholder="Current Type..."
				onChange={(e) => setOldType(e.target.value)}
			/>
			<label htmlFor="oldPrice">Current price:</label>
			<input
				type="text"
				placeholder="Current Price..."
				onChange={(e) => setOldPrice(e.target.value)}
			/>

			<label htmlFor="newPrice">New price:</label>
			<input
				type="text"
				placeholder="New Price..."
				onChange={(e) => setNewPrice(e.target.value)}
			/>
			{oldFlavour && newPrice && <button type="submit">Update Product</button>}
		</form>
	);
}

export { UpdateProductForm };
