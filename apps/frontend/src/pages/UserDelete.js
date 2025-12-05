import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { DeleteUser } from "../components/DeleteUser";

function UserDelete() {
	const search = useSearch({ strict: false });
	return (
		<>
			{search?.errorMessage && (
				<Alert variant="danger">{search.errorMessage}</Alert>
			)}
			<DeleteUser />
		</>
	);
}

export default UserDelete;
