import ErrorBoundary from "../components/ErrorBoundary";
import { UpdateOrder } from "../components/UpdateOrder";

function UpdateOrderPage() {
	return (
		<div>
			<ErrorBoundary
				fallback={<h1>Something went wrong updating the order</h1>}
			>
				<UpdateOrder />
			</ErrorBoundary>
		</div>
	);
}

export default UpdateOrderPage;
