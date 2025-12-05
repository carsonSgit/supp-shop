import React from "react";
import { DisplayUserProps } from "../shared/types/components.types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

/**
 * Component to display a given user
 * @props {Object} user: user to display containing name and type fields.
 * @props {string} heading: string describing the user to display.
 */
function DisplayUser(props: DisplayUserProps): React.JSX.Element {
	const getInitials = (username: string): string => {
		return username
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center space-x-4">
					<Avatar className="h-16 w-16">
						<AvatarFallback className="text-lg">
							{getInitials(props.user.username)}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle className="text-2xl">{props.heading}</CardTitle>
						<CardDescription>User profile information</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<Separator />
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-muted-foreground">
							Username:
						</span>
						<span className="text-lg font-semibold">
							{props.user.username}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-muted-foreground">
							Email:
						</span>
						<span className="text-lg">{props.user.email}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { DisplayUser };
