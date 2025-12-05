import React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "../api/auth";
import { LoginResponse } from "../api/types";

interface LoginFormProps {
	setAdded: (result: LoginResponse) => void;
}

/**
 * Component representing the login form.
 *
 * @param {Object} props - Component props.
 * @param {function} props.setAdded - Function to update the added user.
 * @returns {JSX.Element} - Login form component.
 */
function LoginForm(props: LoginFormProps): React.JSX.Element {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!username || !password) return;

		try {
			const result = await authApi.login({ username, password });
			props.setAdded(result);
			navigate({ to: "/" });
		} catch (error: unknown) {
			const errorMessage = (error as { errorMessage?: string; message?: string }).errorMessage || 
				(error as { errorMessage?: string; message?: string }).message || 
				"Login failed";
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

			<label htmlFor="password">Password</label>
			<input
				type="password"
				placeholder="Password..."
				onChange={(e) => setPassword(e.target.value)}
			/>

			{username && password && <button type="submit">Login</button>}
		</form>
	);
}

export { LoginForm };

