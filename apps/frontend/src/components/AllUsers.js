import { ListUsers } from "./ListUsers";
import { useUsers } from "../features/users/hooks/useUsers";

/**
 * Component that lets the user get all the users and then displays them as a list.
 * @returns
 */
function AllUsers() {
	const { data: users = [], refetch, isLoading, error } = useUsers();

	const callGetAllUsers = () => {
		refetch();
	};

	if (error) {
		return <div>Error loading users: {error.message}</div>;
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
