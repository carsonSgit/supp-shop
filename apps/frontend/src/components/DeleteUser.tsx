import React from "react";
import { useState } from "react";
import { DeleteUserForm } from "./DeleteUserForm";
import { DisplayUser } from "./DisplayUser";
import { User } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Component that handles the process of deleting a user.
 *
 * @returns  JSX containing the delete user form and the display of the deleted user.
 */
function DeleteUser(): React.JSX.Element {
	const [deleted, setDeleted] = useState<User>({} as User);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Delete User</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<DeleteUserForm setDeleted={setDeleted} />
					{(deleted.username || deleted.email) && (
						<>
							<Separator />
							<DisplayUser user={deleted} heading="The deleted user is" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { DeleteUser };
