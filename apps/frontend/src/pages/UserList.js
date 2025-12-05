import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { AllUsers } from "../components/AllUsers";

function UserList() {
	const search = useSearch({ strict: false });
	return (
		<>
			{search?.errorMessage && (
				<Alert variant="danger">{search.errorMessage}</Alert>
			)}
			<AllUsers />
		</>
	);
}

export default UserList;
