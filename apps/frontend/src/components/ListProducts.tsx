import React from "react";
import { Product } from "../api/types";

interface ListProductsProps {
	products: Product[];
}

/**
 * Simple component to display a list of products.
 * @param {Object Array} products: the array of products in the database.
 * @returns a list of all products sorted by id.
 */
function ListProducts({ products }: ListProductsProps): React.JSX.Element {
	return (
		<div>
			<h1>All Products</h1>
			<ul>
				{products.map((product) => (
					<li key={(product as { _id?: string })._id}>
						<br />
						{product.flavour} of type {product.type || ""} for ${String(product.price)}.
						<br />
						Description: {(product as { description?: string }).description || ""}
					</li>
				))}
			</ul>
		</div>
	);
}

export { ListProducts };

