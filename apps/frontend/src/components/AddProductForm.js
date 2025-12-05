import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateProduct } from "../features/products/hooks/useProducts";

/**
 * Functionality for adding a product according to given parameters.
 * Uses a POST request to add the product to the database.
 * @param {Object} props: the parameters of the product to be added.
 * @returns user-input fields that hold values for the product.
 */
function AddProductForm(props) {
	const flavourRef = useRef(null);
	const typeRef = useRef(null);
	const priceRef = useRef(null);
	const descriptionRef = useRef(null);
	const navigate = useNavigate();
	const createProduct = useCreateProduct();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const result = await createProduct.mutateAsync({
				flavour: flavourRef.current.value,
				type: typeRef.current.value,
				price: priceRef.current.value,
				description: descriptionRef.current.value,
			});
			props.setAdded(result);
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to create product";
			if (error.status === 500) {
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
