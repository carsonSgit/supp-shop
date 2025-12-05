import { useNavigate } from "react-router-dom";
import "./Menu.css";

function OrderMenu() {
	const navigate = useNavigate();

	const handleAdd = () => {
		navigate("/add");
	};

	const handleFindOne = () => {
		navigate("/getone");
	};

	const handleFindAll = () => {
		navigate("/getall");
	};

	const handleUpdate = () => {
		navigate("/update");
	};

	const handleDelete = () => {
		navigate("/delete");
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
