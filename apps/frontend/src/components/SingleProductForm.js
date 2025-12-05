import { useState } from "react";

/**
 * Component representing the form to get a single product.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setAdded - Function to set the added product.
 * @returns {JSX.Element} - Get single product form component.
 */
function GetSingleProductForm(props) {
	const [flavour, setFlavour] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const requestOptions = {
			method: "GET",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
			credentials: "include",
		};

		const response = await fetch(
			"http://localhost:1339/products/" + flavour,
			requestOptions,
		);
		const result = await response.json();
		props.setAdded(result);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="getProductFlavour">Product Flavour</label>
			<input
				type="text"
				placeholder="Product Flavour"
				onChange={(e) => setFlavour(e.target.value)}
			/>
			{flavour && <button type="submit">Get Product</button>}
		</form>
	);
}

export { GetSingleProductForm };
