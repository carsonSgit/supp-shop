import React from "react";
import { Order } from "../api/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useTranslation } from "../shared/hooks/useTranslation";

interface ListOrdersProps {
	orders?: Order[];
}

function ListOrders({ orders }: ListOrdersProps): React.JSX.Element {
	const t = useTranslation();
	
	if (!orders || orders.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t.pages.orders.allOrders}</CardTitle>
					<CardDescription>{t.pages.orders.noOrders}</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.pages.orders.allOrders}</CardTitle>
				<CardDescription>
					{t.pages.orders.listSubtitle}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t.pages.orders.orderId}</TableHead>
							<TableHead>{t.pages.orders.price}</TableHead>
							<TableHead>{t.pages.orders.status}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => {
							const price = (order as { price?: string | number }).price;
							return (
								<TableRow key={order.orderID}>
									<TableCell className="font-medium">
										{order.orderID}
									</TableCell>
									<TableCell>
										{price ? `$${price}` : "N/A"}
									</TableCell>
									<TableCell>
										<Badge variant="outline">{t.pages.orders.active}</Badge>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export { ListOrders };
