import React from "react";
import { useState } from "react";
import { AddUserForm } from "./AddUserForm";
import { DisplayUser } from "./DisplayUser";
import { User } from "../api/types";

/* Component that lets the user get a user and then displays it to the screen */
function AddUser(): React.JSX.Element {
	const [added, setAdded] = useState<User>({} as User); //Empty object by default

	return (
		<>
			<AddUserForm setAdded={setAdded} />
			<DisplayUser user={added} heading="The added user is" />
		</>
	);
}
export { AddUser };

