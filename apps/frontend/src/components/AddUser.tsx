import React from "react";
import { useState } from "react";
import { AddUserForm } from "./AddUserForm";
import { DisplayUser } from "./DisplayUser";
import { User } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/* Component that lets the user get a user and then displays it to the screen */
function AddUser(): React.JSX.Element {
	const [added, setAdded] = useState<User>({} as User); //Empty object by default

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New User</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<AddUserForm setAdded={setAdded} />
					{(added.username || added.email) && (
						<>
							<Separator />
							<DisplayUser user={added} heading="The added user is" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
export { AddUser };
