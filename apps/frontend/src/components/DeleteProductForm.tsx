import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteProduct } from "../features/products/hooks/useProducts";
import { FormWithSetDeletedProps } from "../shared/types/components.types";
import { Product } from "../api/types";

/**
 * Functionality for deleting a product according to given parameters.
 * Uses a DELETE request to update the product in the database.
 * @param {Object} props: the parameter of the product to be deleting.
 * @returns user-input field that holds a value for the product.
 */
function DeleteProductForm(props: FormWithSetDeletedProps<Product>): React.JSX.Element {
	const [oldFlavour, setOldFlavour] = useState<string>("");

	const navigate = useNavigate();
	const deleteProduct = useDeleteProduct();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!oldFlavour) return;

		try {
			await deleteProduct.mutateAsync({
				flavour: oldFlavour,
				price: 0,
			});
			props.setDeleted({ flavour: oldFlavour, price: 0 });
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to delete product";
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

