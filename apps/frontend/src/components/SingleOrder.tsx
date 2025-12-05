import React from "react";
import { useState } from "react";
import { GetSingleOrderForm } from "./SingleOrderForm";
import { DisplayOrder } from "./DisplayOrder";
import { Order } from "../api/types";

/**
 * Component representing the single order page.
 *
 * @returns {JSX.Element} - Single order component.
 */
function SingleOrder(): React.JSX.Element {
	const [added, setAdded] = useState<Order>({} as Order);

	return (
		<>
			<GetSingleOrderForm setFetched={setAdded} />
			<DisplayOrder order={added} heading="The found order is: " />
		</>
	);
}

export { SingleOrder };

