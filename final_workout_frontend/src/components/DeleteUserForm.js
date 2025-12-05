import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (event) => {
		event.preventDefault();

		/** Options that indicate a post request passed in JSON body */
		const requestOptions = {
			method: "DELETE",
			body: JSON.stringify({
				email: email,
			}),
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
		};
		const response = await fetch(
			`http://localhost:1339/users/${username}`,
			requestOptions,
		);
		const result = await response.json();
		if (response.status === 400 || response.status === 500)
			navigate("/", { state: { errorMessage: result.errorMessage } });
		else props.setDeleted(result);
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
