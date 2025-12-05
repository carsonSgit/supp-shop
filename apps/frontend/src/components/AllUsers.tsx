import React from "react";
import { ListUsers } from "./ListUsers";
import { useUsers } from "../features/users/hooks/useUsers";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * Component that lets the user get all the users and then displays them as a list.
 * @returns
 */
function AllUsers(): React.JSX.Element {
	const { data: users = [], refetch, isLoading, error } = useUsers();

	const callGetAllUsers = (): void => {
		refetch();
	};

	if (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return (
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Error Loading Users</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
					<Button onClick={() => refetch()} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Users</CardTitle>
						<Button onClick={callGetAllUsers} disabled={isLoading}>
							<RefreshCw
								className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
							/>
							{isLoading ? "Loading..." : "Refresh Users"}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ListUsers users={users} />
				</CardContent>
			</Card>
		</div>
	);
}
export { AllUsers };
