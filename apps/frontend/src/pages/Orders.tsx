import React from "react";
import OrderMenu from "../components/Menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useTranslation } from "../shared/hooks/useTranslation";

function Orders(): React.JSX.Element {
	const t = useTranslation();
	
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl">
						{t.pages.orders.welcome}
					</CardTitle>
					<CardDescription>
						{t.pages.orders.subtitle}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<OrderMenu />
				</CardContent>
			</Card>
		</div>
	);
}

export default Orders;
