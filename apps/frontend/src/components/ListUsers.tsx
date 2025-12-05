import React from "react";
import { User } from "../api/types";

interface ListUsersProps {
	users: User[];
}

/**
 * Component that accepts a prop containing an array of users
 * and outputs that array as a list on the screen.
 * @props users: Array of users, each containing name and email
 * @returns JSX list of users
 */
function ListUsers({ users }: ListUsersProps): React.JSX.Element {
	return (
		<div>
			<h1>All Users</h1>
			<ul>
				{users.map((user) => (
					<li key={(user as { _id?: string })._id}>
						Username:{user.username} Email: {user.email}.
					</li>
				))}
			</ul>
		</div>
	);
}

export { ListUsers };

