import React from "react";
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateProduct } from "../features/products/hooks/useProducts";
import { FormWithSetAddedProps } from "../shared/types/components.types";
import { Product } from "../api/types";

/**
 * Functionality for adding a product according to given parameters.
 * Uses a POST request to add the product to the database.
 * @param {Object} props: the parameters of the product to be added.
 * @returns user-input fields that hold values for the product.
 */
function AddProductForm(props: FormWithSetAddedProps<Product>): React.JSX.Element {
	const flavourRef = useRef<HTMLInputElement>(null);
	const typeRef = useRef<HTMLInputElement>(null);
	const priceRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const createProduct = useCreateProduct();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		try {
			const result = await createProduct.mutateAsync({
				flavour: flavourRef.current?.value || "",
				type: typeRef.current?.value || "",
				price: priceRef.current?.value || "",
				description: descriptionRef.current?.value || "",
			});
			props.setAdded(result);
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to create product";
			const errorStatus = (error as { status?: number }).status;
			if (errorStatus === 500) {
				navigate({
					to: "/systemerror",
					search: { errorMessage },
				});
			} else {
				navigate({
					to: "/",
					search: { errorMessage },
				});
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="flavour">Flavour:</label>
			<input type="text" placeholder="Flavour..." ref={flavourRef} required />

			<label htmlFor="type">Type:</label>
			<input type="text" placeholder="Type..." ref={typeRef} required />

			<label htmlFor="price">Price:</label>
			<input type="text" placeholder="Price..." ref={priceRef} required />

			<label htmlFor="description">Description:</label>
			<input
				type="text"
				placeholder="Description..."
				ref={descriptionRef}
				required
			/>

			<button type="submit">Add Product</button>
		</form>
	);
}

export { AddProductForm };

