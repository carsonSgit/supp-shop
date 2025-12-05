import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "../api/auth";

/**
 * Component representing the login form.
 *
 * @param {Object} props - Component props.
 * @param {function} props.setAdded - Function to update the added user.
 * @returns {JSX.Element} - Login form component.
 */
function LoginForm(props) {
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);

	const navigate = useNavigate();

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const result = await authApi.login({ username, password });
			props.setAdded(result);
			navigate({ to: "/" });
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Login failed";
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
