import React from "react";
import { useSearch } from "@tanstack/react-router";
import { DeleteUser } from "../components/DeleteUser";
import { RouteSearchParams } from "../shared/types/routes.types";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

function UserDelete(): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
	return (
		<div className="space-y-4">
			{search?.errorMessage && (
				<div className="container mx-auto px-4 pt-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{search.errorMessage}</AlertDescription>
					</Alert>
				</div>
			)}
			<DeleteUser />
		</div>
	);
}

export default UserDelete;
