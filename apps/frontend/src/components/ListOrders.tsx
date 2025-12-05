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

interface ListOrdersProps {
	orders?: Order[];
}

function ListOrders({ orders }: ListOrdersProps): React.JSX.Element {
	if (!orders || orders.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>All Orders</CardTitle>
					<CardDescription>No orders found</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>All Orders</CardTitle>
				<CardDescription>
					View and manage all orders in the system
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Status</TableHead>
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
										<Badge variant="outline">Active</Badge>
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
