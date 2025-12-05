import React from "react";
import { User } from "../api/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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
	const getInitials = (username: string): string => {
		return username
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>All Users</CardTitle>
				<CardDescription>
					Manage user accounts and permissions
				</CardDescription>
			</CardHeader>
			<CardContent>
				{users.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						No users found
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Username</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => {
								const userId = (user as { _id?: string })._id;
								return (
									<TableRow key={userId}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<Avatar>
													<AvatarFallback>
														{getInitials(user.username)}
													</AvatarFallback>
												</Avatar>
												<span className="font-medium">{user.username}</span>
											</div>
										</TableCell>
										<TableCell>{user.username}</TableCell>
										<TableCell>{user.email}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}

export { ListUsers };
