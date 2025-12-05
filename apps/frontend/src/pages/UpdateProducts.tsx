import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { UpdateProduct } from "../components/UpdateProduct";

function UpdateProducts(): React.JSX.Element {
	return (
		<ErrorBoundary>
			<UpdateProduct />
		</ErrorBoundary>
	);
}

export default UpdateProducts;
