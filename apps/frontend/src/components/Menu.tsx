import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Plus, Search, List, Edit, Trash2 } from "lucide-react";

function OrderMenu(): React.JSX.Element {
	const navigate = useNavigate();

	const handleAdd = (): void => {
		navigate({ to: "/add" });
	};

	const handleFindOne = (): void => {
		navigate({ to: "/getone" });
	};

	const handleFindAll = (): void => {
		navigate({ to: "/getall" });
	};

	const handleUpdate = (): void => {
		navigate({ to: "/update" });
	};

	const handleDelete = (): void => {
		navigate({ to: "/delete" });
	};

	return (
		<div className="flex flex-col sm:flex-row gap-4 flex-wrap">
			<Button onClick={handleAdd} variant="default" className="flex-1 min-w-[200px]">
				<Plus className="mr-2 h-4 w-4" />
				Add Order
			</Button>
			<Button onClick={handleFindOne} variant="outline" className="flex-1 min-w-[200px]">
				<Search className="mr-2 h-4 w-4" />
				Get Single Order
			</Button>
			<Button onClick={handleFindAll} variant="outline" className="flex-1 min-w-[200px]">
				<List className="mr-2 h-4 w-4" />
				Show All Orders
			</Button>
			<Button onClick={handleUpdate} variant="outline" className="flex-1 min-w-[200px]">
				<Edit className="mr-2 h-4 w-4" />
				Update Order
			</Button>
			<Button onClick={handleDelete} variant="destructive" className="flex-1 min-w-[200px]">
				<Trash2 className="mr-2 h-4 w-4" />
				Delete Order
			</Button>
		</div>
	);
}

export default OrderMenu;
