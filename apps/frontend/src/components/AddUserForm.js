import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateUser } from "../features/users/hooks/useUsers";

/**
 * Component that lets the user enter in the name, email and password of a new user
 * and then calls the backend to add it.
 * Side effect: passes the added user using setAdded
 * @returns JSX containing the form.
 */
function AddUserForm(props) {
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);

	const navigate = useNavigate();
	const createUser = useCreateUser();

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const result = await createUser.mutateAsync({ username, email, password });
			props.setAdded(result);
		} catch (error) {
			const errorMessage = error.errorMessage || error.message || "Failed to add user";
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
