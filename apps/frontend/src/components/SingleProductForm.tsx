import React from "react";
import { useState, useEffect } from "react";
import { useProduct } from "../features/products/hooks/useProducts";
import { FormWithSetFetchedProps } from "../shared/types/components.types";
import { Product } from "../api/types";

/**
 * Component representing the form to get a single product.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setAdded - Function to set the added product.
 * @returns {JSX.Element} - Get single product form component.
 */
function GetSingleProductForm(props: FormWithSetFetchedProps<Product>): React.JSX.Element {
	const [flavour, setFlavour] = useState("");
	const [submittedFlavour, setSubmittedFlavour] = useState("");
	const { data, isLoading, error } = useProduct(submittedFlavour);

	useEffect(() => {
		if (data) {
			props.setFetched(data);
		}
	}, [data, props]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		if (flavour) {
			setSubmittedFlavour(flavour);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="getProductFlavour">Product Flavour</label>
			<input
				type="text"
				placeholder="Product Flavour"
				value={flavour}
				onChange={(e) => setFlavour(e.target.value)}
			/>
			{flavour && (
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Loading..." : "Get Product"}
				</button>
			)}
			{error && <div style={{ color: "red" }}>Error: {error.message}</div>}
		</form>
	);
}

export { GetSingleProductForm };

