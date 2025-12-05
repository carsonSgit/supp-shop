import React from "react";
import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { DeleteProduct } from "../components/DeleteProduct";
import { RouteSearchParams } from "../shared/types/routes.types";

function DeleteProducts(): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
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

