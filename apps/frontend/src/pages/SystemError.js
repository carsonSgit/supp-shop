import { Link, useSearch } from "@tanstack/react-router";

function SystemError({ errorMessage }) {
	const search = useSearch({ strict: false });
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
