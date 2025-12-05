import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Functionality for deleting a product according to given parameters.
 * Uses a DELETE request to update the product in the database.
 * @param {Object} props: the parameter of the product to be deleting.
 * @returns user-input field that holds a value for the product.
 */
// doesn't work
function DeleteProductForm(props) {
	const [oldFlavour, setOldFlavour] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		const requestOptions = {
			method: "DELETE",
			body: JSON.stringify({
				flavour: oldFlavour,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		};
		const response = await fetch(
			"http://localhost:1339/products",
			requestOptions,
		);
		const result = await response.json();
		if (response.status === 400 || response.status === 500)
			navigate("/", { state: { errorMessage: result.errorMessage } });
		else props.setDeleted(result);
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
