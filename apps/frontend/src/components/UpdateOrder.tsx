import React from "react";
import { useState } from "react";
import { UpdateOrderForm } from "./UpdateOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";

function UpdateOrder(): React.JSX.Element {
	const [updated, setUpdated] = useState<Order>({} as Order);

	return (
		<>
			<UpdateOrderForm setUpdated={setUpdated} />
			<DisplayOrder order={updated} heading="The updated order is" />
		</>
	);
}

export { UpdateOrder };

