import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateProduct } from "../features/products/hooks/useProducts";
import { FormWithSetUpdatedProps } from "../shared/types/components.types";
import { Product } from "../api/types";

/**
 * Functionality for updating a product according to given parameters.
 * Uses a PUT request to update the product in the database.
 * @param {Object} props: the parameters of the product to be updated.
 * @returns user-input fields that hold values for the product.
 */
function UpdateProductForm(props: FormWithSetUpdatedProps<Product>): React.JSX.Element {
	const [oldFlavour, setOldFlavour] = useState<string>("");
	const [oldType, setOldType] = useState<string>("");
	const [oldPrice, setOldPrice] = useState<string>("");
	const [newPrice, setNewPrice] = useState<string>("");

	const navigate = useNavigate();
	const updateProduct = useUpdateProduct();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!oldFlavour || !newPrice) return;

		try {
			const priceValue = oldPrice ? (isNaN(Number(oldPrice)) ? oldPrice : Number(oldPrice)) : 0;
			const result = await updateProduct.mutateAsync({
				flavour: oldFlavour,
				type: oldType || undefined,
				price: priceValue,
				updatePrice: newPrice,
			});
			props.setUpdated(result);
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to update product";
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

