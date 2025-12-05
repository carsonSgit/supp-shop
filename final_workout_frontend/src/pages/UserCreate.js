import { useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { AddUser } from "../components/AddUser";

function UserCreate() {
	const { state } = useLocation();
	return (
		<>
			{state && state.errorMessage && (
				<Alert variant="danger">{state.errorMessage}</Alert>
			)}
			<AddUser />
		</>
	);
}

export default UserCreate;
