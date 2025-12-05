import React from "react";
import { ListUsers } from "./ListUsers";
import { useUsers } from "../features/users/hooks/useUsers";

/**
 * Component that lets the user get all the users and then displays them as a list.
 * @returns
 */
function AllUsers(): React.JSX.Element {
	const { data: users = [], refetch, isLoading, error } = useUsers();

	const callGetAllUsers = (): void => {
		refetch();
	};

	if (error) {
		const errorMessage = error instanceof Error 
			? error.message 
			: 'Unknown error occurred';
		return (
			<div style={{ color: 'red', padding: '10px' }}>
				<p>Error loading users: {errorMessage}</p>
				<button onClick={() => refetch()}>Retry</button>
			</div>
		);
	}

	return (
		<>
			<ListUsers users={users} />
			<button onClick={callGetAllUsers} disabled={isLoading}>
				{isLoading ? "Loading..." : "Get All Users"}
			</button>
		</>
	);
}
export { AllUsers };

