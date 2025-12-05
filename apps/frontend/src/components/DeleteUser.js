import { useState } from "react";
import { DeleteUserForm } from "./DeleteUserForm";
import { DisplayUser } from "./DisplayUser";

/**
 * Component that handles the process of deleting a user.
 *
 * @returns  JSX containing the delete user form and the display of the deleted user.
 */
function DeleteUser() {
	const [deleted, setDeleted] = useState({});

	return (
		<>
			<DeleteUserForm setDeleted={setDeleted} />
			<DisplayUser user={deleted} heading="The deleted user is" />
		</>
	);
}

export { DeleteUser };
