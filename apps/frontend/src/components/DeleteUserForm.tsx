import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteUser } from "../features/users/hooks/useUsers";
import { FormWithSetDeletedProps } from "../shared/types/components.types";
import { User } from "../api/types";

/**
 * Component that lets the user enter in the name, email of a user
 * and then calls the backend to delete it.
 * Side effect: passes the deleted user using setDeleted
 * @returns JSX containing the form.
 */
function DeleteUserForm(props: FormWithSetDeletedProps<User>): React.JSX.Element {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	const navigate = useNavigate();
	const deleteUser = useDeleteUser();

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!username || !email) return;

		try {
			await deleteUser.mutateAsync(username);
			props.setDeleted({ username, email });
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to delete user";
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

