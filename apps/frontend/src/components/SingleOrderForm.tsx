import React from "react";
import { useState, useEffect } from "react";
import { useOrder } from "../features/orders/hooks/useOrders";
import { FormWithSetFetchedProps } from "../shared/types/components.types";
import { Order } from "../api/types";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const orderFormSchema = z.object({
	orderID: z.string().min(1, "Order ID is required"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

/**
 * Component representing the form to get a single order.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setFetched - Function to set the fetched order.
 * @returns {JSX.Element} - Get single order form component.
 */
function GetSingleOrderForm(props: FormWithSetFetchedProps<Order>): React.JSX.Element {
	const [submittedOrderID, setSubmittedOrderID] = useState("");
	const { data, isLoading, error } = useOrder(submittedOrderID);

	const form = useForm<OrderFormValues>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			orderID: "",
		},
	});

	useEffect(() => {
		if (data) {
			props.setFetched(data);
		}
	}, [data, props]);

	const handleSubmit = async (values: OrderFormValues): Promise<void> => {
		if (values.orderID) {
			setSubmittedOrderID(values.orderID);
		}
	};

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="orderID"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Order ID</FormLabel>
								<FormControl>
									<Input placeholder="Order ID" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Loading..." : "Get Order"}
					</Button>
				</form>
			</Form>

			{isLoading && (
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			)}

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>Error: {error.message}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}

export { GetSingleOrderForm };
