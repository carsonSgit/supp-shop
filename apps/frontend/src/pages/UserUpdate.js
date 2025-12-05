import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { UpdateUser } from "../components/UpdateUser";

function UserUpdate() {
	const search = useSearch({ strict: false });
	return (
		<>
			{search?.errorMessage && (
				<Alert variant="danger">{search.errorMessage}</Alert>
			)}
			<UpdateUser />
		</>
	);
}

export default UserUpdate;
