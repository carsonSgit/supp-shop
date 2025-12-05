import { LoginForm } from "./LoginForm";
import { DisplayUser } from "./DisplayUser";
import { useState } from "react";

/**
 * Component representing the login page.
 *
 * @returns {JSX.Element} - Login component.
 */
function Login() {
	const [added, setAdded] = useState({});

	return (
		<>
			<LoginForm setAdded={setAdded} />
			<DisplayUser user={added} heading="Login here please" />
		</>
	);
}

export { Login };
