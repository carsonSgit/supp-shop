import React from "react";
import { useSearch } from "@tanstack/react-router";
import { DeleteProduct } from "../components/DeleteProduct";
import { RouteSearchParams } from "../shared/types/routes.types";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

function DeleteProducts(): React.JSX.Element {
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
			<DeleteProduct />
		</div>
	);
}

export default DeleteProducts;
