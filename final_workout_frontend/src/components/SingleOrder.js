import { useState } from "react";
import { GetSingleOrderForm } from "./SingleOrderForm";
import { DisplayOrder } from "./DisplayOrder";

/**
 * Component representing the single order page.
 *
 * @returns {JSX.Element} - Single order component.
 */
function SingleOrder() {
	const [added, setAdded] = useState({});

	return (
		<>
			<GetSingleOrderForm setAdded={setAdded} />
			<DisplayOrder order={added} heading="The found order is: " />
		</>
	);
}

export { SingleOrder };
