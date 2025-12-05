import React from "react";
import { useState } from "react";
import { UpdateUserForm } from "./UpdateUserForm";
import { DisplayUser } from "./DisplayUser";
import { User } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

/** Component that lets the user update a user and then displays it to the screen. */
function UpdateUser(): React.JSX.Element {
	const [updated, setUpdated] = useState<User>({} as User); //Empty object by default

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Update User</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<UpdateUserForm setUpdated={setUpdated} />
					{(updated.username || updated.email) && (
						<>
							<Separator />
							<DisplayUser user={updated} heading="The changed user is" />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { UpdateUser };
