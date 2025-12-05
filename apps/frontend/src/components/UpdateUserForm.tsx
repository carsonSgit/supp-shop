import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateUser } from "../features/users/hooks/useUsers";
import { FormWithSetUpdatedProps } from "../shared/types/components.types";
import { User } from "../api/types";

/**
 * Component that lets the user enter in the old and new username and email and password
 * of a user and then calls the backend to change it.
 *
 * @props {function} setUpdated: To pass back the changed user by side-effect
 * @returns  JSX containing the form.
 */
function UpdateUserForm(props: FormWithSetUpdatedProps<User>): React.JSX.Element {
	const [oldUsername, setOldUsername] = useState<string>("");
	const [newUsername, setNewUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();
	const updateUser = useUpdateUser();

	/** Handler method that makes the fetch request based on the form values. */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!oldUsername || !newUsername || !email || !password) return;

		try {
			const result = await updateUser.mutateAsync({
				username: oldUsername,
				user: {
					username: newUsername,
					email: email,
					password: password,
				},
			});
			props.setUpdated(result);
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to update user";
			navigate({ 
				to: "/", 
				search: { errorMessage } 
			});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="oldUsername">Current username</label>
			<input
				type="text"
				placeholder="Current Username..."
				onChange={(e) => setOldUsername(e.target.value)}
			/>

			<label htmlFor="newUsername">New username</label>
			<input
				type="text"
				placeholder="New Username..."
				onChange={(e) => setNewUsername(e.target.value)}
			/>

			<label htmlFor="email">New Email</label>
			<input
				type="text"
				placeholder="New Email..."
				onChange={(e) => setEmail(e.target.value)}
			/>

			<label htmlFor="password">New Password</label>
			<input
				type="password"
				placeholder="New Password..."
				onChange={(e) => setPassword(e.target.value)}
			/>

			{oldUsername && newUsername && email && password && (
				<button type="submit">Update User</button>
			)}
		</form>
	);
}

export { UpdateUserForm };

