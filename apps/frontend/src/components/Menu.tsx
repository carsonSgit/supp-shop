import React from "react";
import { useNavigate } from "@tanstack/react-router";
import "./Menu.css";

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
		<div>
			<button id="menuButton" onClick={handleAdd}>
				Add Order
			</button>
			<br />     {" "}
			<button id="menuButton" onClick={handleFindOne}>
				Get Single Order
			</button>
			      <br />     {" "}
			<button id="menuButton" onClick={handleFindAll}>
				Show All Orders
			</button>
			      <br />     {" "}
			<button id="menuButton" onClick={handleUpdate}>
				Update Order
			</button>
			<br />
			<button id="menuButton" onClick={handleDelete}>
				Delete Order
			</button>
		   {" "}
		</div>
	);
}

export default OrderMenu;

