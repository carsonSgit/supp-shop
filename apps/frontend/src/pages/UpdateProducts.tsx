import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { UpdateProduct } from "../components/UpdateProduct";

function UpdateProducts(): React.JSX.Element {
	return (
		<div>
			<ErrorBoundary>
				<UpdateProduct />
			</ErrorBoundary>
		</div>
	);
}

export default UpdateProducts;

