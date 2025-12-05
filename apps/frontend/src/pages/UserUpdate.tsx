import React from "react";
import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { UpdateUser } from "../components/UpdateUser";
import { RouteSearchParams } from "../shared/types/routes.types";

function UserUpdate(): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
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

