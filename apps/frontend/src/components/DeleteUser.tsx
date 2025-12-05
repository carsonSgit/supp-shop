import React from "react";
import { useState } from "react";
import { DeleteUserForm } from "./DeleteUserForm";
import { DisplayUser } from "./DisplayUser";
import { User } from "../api/types";

/**
 * Component that handles the process of deleting a user.
 *
 * @returns  JSX containing the delete user form and the display of the deleted user.
 */
function DeleteUser(): React.JSX.Element {
	const [deleted, setDeleted] = useState<User>({} as User);

	return (
		<>
			<DeleteUserForm setDeleted={setDeleted} />
			<DisplayUser user={deleted} heading="The deleted user is" />
		</>
	);
}

export { DeleteUser };

