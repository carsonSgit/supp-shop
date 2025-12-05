import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateOrder } from "../features/orders/hooks/useOrders";
import { FormWithSetAddedProps } from "../shared/types/components.types";
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
import { useToast } from "./ui/use-toast";

const orderFormSchema = z.object({
	orderID: z.string().min(1, "Order ID is required"),
	price: z.string().min(1, "Price is required"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

/**
 * Component that lets the user enter the order ID and price to add a new order,
 * and calls the backend to add it.
 *
 * @props {function} setAdded: To pass back the added order by side-effect
 * @returns  JSX containing the form.
 */
function AddOrderForm(props: FormWithSetAddedProps<Order>): React.JSX.Element {
	const navigate = useNavigate();
	const createOrder = useCreateOrder();
	const { toast } = useToast();

	const form = useForm<OrderFormValues>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			orderID: "",
			price: "",
		},
	});

	const handleSubmit = async (values: OrderFormValues): Promise<void> => {
		try {
			const result = await createOrder.mutateAsync({
				orderID: values.orderID,
				price: values.price,
			});
			props.setAdded(result);
			form.reset();
			toast({
				title: "Success",
				description: "Order created successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to create order";
			const errorStatus = (error as { status?: number }).status;
			if (errorStatus === 500) {
				navigate({
					to: "/systemerror",
					search: { errorMessage },
				});
			} else {
				toast({
					title: "Error",
					description: errorMessage,
					variant: "destructive",
				});
			}
		}
	};

	return (
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

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input placeholder="Price" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={createOrder.isPending}>
					{createOrder.isPending ? "Creating..." : "New Order"}
				</Button>
			</form>
		</Form>
	);
}

export { AddOrderForm };
