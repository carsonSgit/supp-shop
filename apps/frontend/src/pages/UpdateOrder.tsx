import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { UpdateOrder } from "../components/UpdateOrder";

function UpdateOrderPage(): React.JSX.Element {
	return (
		<ErrorBoundary>
			<UpdateOrder />
		</ErrorBoundary>
	);
}

export default UpdateOrderPage;
