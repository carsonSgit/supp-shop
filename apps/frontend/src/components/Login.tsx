import React from "react";
import { LoginForm } from "./LoginForm";
import { DisplayUser } from "./DisplayUser";
import { useState } from "react";
import { LoginResponse, User } from "../api/types";

/**
 * Component representing the login page.
 *
 * @returns {JSX.Element} - Login component.
 */
function Login(): React.JSX.Element {
	const [added, setAdded] = useState<User | LoginResponse>({} as User);

	return (
		<>
			<LoginForm setAdded={setAdded as (result: LoginResponse) => void} />
			<DisplayUser user={added as User} heading="Login here please" />
		</>
	);
}

export { Login };

