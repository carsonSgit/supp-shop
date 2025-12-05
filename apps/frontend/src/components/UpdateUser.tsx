import React from "react";
import { useState } from "react";
import { UpdateUserForm } from "./UpdateUserForm";
import { DisplayUser } from "./DisplayUser";
import { User } from "../api/types";

/** Component that lets the user update a user and then displays it to the screen. */
function UpdateUser(): React.JSX.Element {
	const [updated, setUpdated] = useState<User>({} as User); //Empty object by default

	return (
		<>
			<UpdateUserForm setUpdated={setUpdated} />
			<DisplayUser user={updated} heading="The changed user is" />
		</>
	);
}

export { UpdateUser };

