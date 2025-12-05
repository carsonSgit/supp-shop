import { useNavigate } from "react-router-dom";
import "./Menu.css";
import { useCookies } from "react-cookie";

/**
 * Component representing the product menu.
 *
 * @returns {JSX.Element} - Product menu component.
 */
function ProductMenu() {
	const [cookies, setCookie] = useCookies(["lang"]);
	const navigate = useNavigate();

	const handleAdd = () => {
		navigate("/productsAdd");
	};

	const handleFindAll = () => {
		navigate("/getProducts");
	};

	const handleUpdate = () => {
		navigate("/productsUpdate");
	};

	const handleDelete = () => {
		navigate("/productsDelete");
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
