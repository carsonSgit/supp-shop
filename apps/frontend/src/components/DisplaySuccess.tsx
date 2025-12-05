import React from "react";
import Card from "./Card";

interface DisplaySuccessProps {
	heading: string;
}

/**
 * Component to display a given product information
 * @param {Object} product: Product to display containing flavour, type, and price
 * @param {string} heading: String describing the product to display
 * @returns a display object holding the product information
 */
function DisplaySuccess(props: DisplaySuccessProps): React.JSX.Element {
	return (
		<>
			<Card>
				{/* Display the product */}
				<h1>{props.heading}</h1>
				<p />
			</Card>
		</>
	);
}

export { DisplaySuccess };

