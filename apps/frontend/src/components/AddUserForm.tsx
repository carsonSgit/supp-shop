import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateUser } from "../features/users/hooks/useUsers";
import { FormWithSetAddedProps } from "../shared/types/components.types";
import { User } from "../api/types";

/**
 * Component that lets the user enter in the name, email and password of a new user
 * and then calls the backend to add it.
 * Side effect: passes the added user using setAdded
 * @returns JSX containing the form.
 */
function AddUserForm(props: FormWithSetAddedProps<User>): React.JSX.Element {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();
	const createUser = useCreateUser();

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!username || !email || !password) return;

		try {
			const result = await createUser.mutateAsync({ username, email, password });
			props.setAdded(result);
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Failed to add user";
			navigate({ 
				to: "/", 
				search: { errorMessage } 
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

			<label htmlFor="password">Password</label>
			<input
				type="password"
				placeholder="Password..."
				onChange={(e) => setPassword(e.target.value)}
			/>

			{username && email && password && <button type="submit">Add User</button>}
		</form>
	);
}
export { AddUserForm };

