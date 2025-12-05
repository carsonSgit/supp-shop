import React from "react";
import { useNavigate } from "@tanstack/react-router";
import "./Menu.css";
import { useCookies } from "react-cookie";

/**
 * Component representing the product menu.
 *
 * @returns {JSX.Element} - Product menu component.
 */
function ProductMenu(): React.JSX.Element {
	const [cookies] = useCookies(["lang"]);
	const navigate = useNavigate();

	const handleAdd = (): void => {
		navigate({ to: "/productsAdd" });
	};

	const handleFindAll = (): void => {
		navigate({ to: "/getProducts" });
	};

	const handleUpdate = (): void => {
		navigate({ to: "/productsUpdate" });
	};

	const handleDelete = (): void => {
		navigate({ to: "/productsDelete" });
	};

	return (
		<div>
			<button id="menuButton" onClick={handleAdd}>
				{cookies.lang === "EN" ? <>Add Product</> : <>Ajouter Produit</>}
			</button>
			<br />
			<button id="menuButton" onClick={handleFindAll}>
				{cookies.lang === "EN" ? <>Our Products</> : <>Nos Produits</>}
			</button>
			<br />
			<button id="menuButton" onClick={handleUpdate}>
				{cookies.lang === "EN" ? <>Update Product</> : <>Modifier Produit</>}
			</button>
			<br />
			<button id="menuButton" onClick={handleDelete}>
				{cookies.lang === "EN" ? <>Delete Product</> : <>Supprimer Produit</>}
			</button>
		</div>
	);
}

export default ProductMenu;

