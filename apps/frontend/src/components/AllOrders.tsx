import React from "react";
import { ListOrders } from "./ListOrders";
import { useOrders } from "../features/orders/hooks/useOrders";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTranslation } from "../shared/hooks/useTranslation";

/**
 * Component that fetches and displays all orders.
 *
 * @returns  JSX containing the button to fetch all orders and the list of orders.
 */
function AllOrders(): React.JSX.Element {
	const { data: orders = [], refetch, isLoading, error } = useOrders();
	const t = useTranslation();

	/**
	 * Function that makes the fetch request to get all orders.
	 */
	const callgetAllOrders = (): void => {
		refetch();
	};

	if (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return (
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>{t.messages.errorLoadingOrders}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>{t.common.error}</AlertTitle>
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
					<Button onClick={() => refetch()} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						{t.pages.orders.retry}
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
						<CardTitle>{t.pages.orders.title}</CardTitle>
						<Button onClick={callgetAllOrders} disabled={isLoading}>
							<RefreshCw
								className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
							/>
							{isLoading ? t.common.loading : t.pages.orders.refreshOrders}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ListOrders orders={orders} />
				</CardContent>
			</Card>
		</div>
	);
}

export { AllOrders };
