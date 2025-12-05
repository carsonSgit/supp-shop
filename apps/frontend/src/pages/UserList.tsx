import React from "react";
import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { AllUsers } from "../components/AllUsers";
import { RouteSearchParams } from "../shared/types/routes.types";

function UserList(): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
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

