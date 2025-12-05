import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { DeleteProduct } from "../components/DeleteProduct";

function DeleteProducts() {
	const search = useSearch({ strict: false });
	return (
		<>
			{search?.errorMessage && (
				<Alert variant="danger">{search.errorMessage}</Alert>
			)}
			<DeleteProduct />
		</>
	);
}

export default DeleteProducts;
