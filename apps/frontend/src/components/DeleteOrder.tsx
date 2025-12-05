import React from "react";
import { useState } from "react";
import { DeleteOrderForm } from "./DeleteOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";

function DeleteOrder(): React.JSX.Element {
	const [added, setAdded] = useState<Order>({} as Order);

	return (
		<>
			<DeleteOrderForm setAdded={setAdded} />
			<DisplayOrder order={added} heading="The deleted order is: " />
		</>
	);
}

export { DeleteOrder };

