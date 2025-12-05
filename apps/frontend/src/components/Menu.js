import { useNavigate } from "@tanstack/react-router";
import "./Menu.css";

function OrderMenu() {
	const navigate = useNavigate();

	const handleAdd = () => {
		navigate({ to: "/add" });
	};

	const handleFindOne = () => {
		navigate({ to: "/getone" });
	};

	const handleFindAll = () => {
		navigate({ to: "/getall" });
	};

	const handleUpdate = () => {
		navigate({ to: "/update" });
	};

	const handleDelete = () => {
		navigate({ to: "/delete" });
	};

	return (
		<div>
			<button id="menuButton" onClick={handleAdd}>
				Add Order
			</button>
			<br />     {" "}
			<button id="menuButton" onClick={handleFindOne}>
				Get Single Order
			</button>
			      <br />     {" "}
			<button id="menuButton" onClick={handleFindAll}>
				Show All Orders
			</button>
			      <br />     {" "}
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
