import React from "react";
import { AllOrders } from "../components/AllOrders";

function GetAll(): React.JSX.Element {
	return (
		<div>
			<p>This is the list of all orders placed</p>

			<AllOrders />
		</div>
	);
}

export default GetAll;

