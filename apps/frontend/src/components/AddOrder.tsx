import React from "react";
import { useState } from "react";
import { AddOrderForm } from "./AddOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";

/**
 * Component that handles the process of adding an order.
 *
 * @returns  JSX containing the add order form and the display of the added order.
 */
function AddOrder(): React.JSX.Element {
	const [added, setAdded] = useState<Order>({} as Order);

	return (
		<>
			<AddOrderForm setAdded={setAdded} />
			<DisplayOrder order={added} heading="The added order is: " />
		</>
	);
}

export { AddOrder };

