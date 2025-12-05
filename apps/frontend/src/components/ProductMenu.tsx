import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCookies } from "react-cookie";
import { Button } from "./ui/button";
import { Plus, Package, Edit, Trash2 } from "lucide-react";

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

	const isEnglish = cookies.lang === "EN" || !cookies.lang;

	return (
		<div className="flex flex-col sm:flex-row gap-4 flex-wrap">
			<Button onClick={handleAdd} variant="default" className="flex-1 min-w-[200px]">
				<Plus className="mr-2 h-4 w-4" />
				{isEnglish ? "Add Product" : "Ajouter Produit"}
			</Button>
			<Button onClick={handleFindAll} variant="outline" className="flex-1 min-w-[200px]">
				<Package className="mr-2 h-4 w-4" />
				{isEnglish ? "Our Products" : "Nos Produits"}
			</Button>
			<Button onClick={handleUpdate} variant="outline" className="flex-1 min-w-[200px]">
				<Edit className="mr-2 h-4 w-4" />
				{isEnglish ? "Update Product" : "Modifier Produit"}
			</Button>
			<Button onClick={handleDelete} variant="destructive" className="flex-1 min-w-[200px]">
				<Trash2 className="mr-2 h-4 w-4" />
				{isEnglish ? "Delete Product" : "Supprimer Produit"}
			</Button>
		</div>
	);
}

export default ProductMenu;
