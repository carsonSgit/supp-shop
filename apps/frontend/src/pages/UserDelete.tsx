import React from "react";
import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { DeleteUser } from "../components/DeleteUser";
import { RouteSearchParams } from "../shared/types/routes.types";

function UserDelete(): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
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

