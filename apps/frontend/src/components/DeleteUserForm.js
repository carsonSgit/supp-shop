import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteUser } from "../features/users/hooks/useUsers";

/**
 * Component that lets the user enter in the name, email of a user
 * and then calls the backend to delete it.
 * Side effect: passes the deleted user using setDeleted
 * @returns JSX containing the form.
 */
function DeleteUserForm(props) {
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);

	const navigate = useNavigate();
	const deleteUser = useDeleteUser();

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await deleteUser.mutateAsync(username);
			props.setDeleted({ username, email });
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to delete user";
			navigate({
				to: "/",
				search: { errorMessage },
			});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="username">Username</label>
			<input
				type="text"
				placeholder="Username..."
				onChange={(e) => setUsername(e.target.value)}
			/>

			<label htmlFor="email">Email</label>
			<input
				type="text"
				placeholder="Email..."
				onChange={(e) => setEmail(e.target.value)}
			/>

			{username && email && <button type="submit">Delete User</button>}
		</form>
	);
}
export { DeleteUserForm };
