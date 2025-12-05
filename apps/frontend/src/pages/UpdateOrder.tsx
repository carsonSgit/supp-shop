import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { UpdateOrder } from "../components/UpdateOrder";

function UpdateOrderPage(): React.JSX.Element {
	return (
		<div>
			<ErrorBoundary>
				<UpdateOrder />
			</ErrorBoundary>
		</div>
	);
}

export default UpdateOrderPage;

