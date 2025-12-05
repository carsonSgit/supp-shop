import { useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { UpdateUser } from "../components/UpdateUser";

function UserUpdate() {
	const { state } = useLocation();
	return (
		<>
			{state && state.errorMessage && (
				<Alert variant="danger">{state.errorMessage}</Alert>
			)}
			<UpdateUser />
		</>
	);
}

export default UserUpdate;
