import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { AddUser } from "../components/AddUser";

function UserCreate() {
	const search = useSearch({ strict: false });
	return (
		<>
			{search?.errorMessage && (
				<Alert variant="danger">{search.errorMessage}</Alert>
			)}
			<AddUser />
		</>
	);
}

export default UserCreate;
