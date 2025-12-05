import React from "react";
import { AddOrder } from "../components/AddOrder";

function AddNewOrder(): React.JSX.Element {
	return (
		<div>
			<h1>Welcome, would you like to add an order</h1>
			<AddOrder />
		</div>
	);
}

export default AddNewOrder;

