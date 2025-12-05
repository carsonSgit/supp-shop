import React from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { RouteSearchParams } from "../shared/types/routes.types";

interface SystemErrorProps {
	errorMessage?: string;
}

function SystemError({ errorMessage }: SystemErrorProps): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
	return (
		<div>
			<h1>Oops! looks like our under resourced systems are broken</h1>
			{errorMessage && <p>{errorMessage}</p>}
			{search?.errorMessage && <p>{search.errorMessage}</p>}
			<Link to="/">Home</Link>
		</div>
	);
}

export default SystemError;

