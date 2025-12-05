import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateOrder } from "../features/orders/hooks/useOrders";
import { FormWithSetUpdatedProps } from "../shared/types/components.types";
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

const updateOrderFormSchema = z.object({
	oldOrderID: z.string().min(1, "Order ID is required"),
	newPrice: z.string().min(1, "New price is required"),
});

type UpdateOrderFormValues = z.infer<typeof updateOrderFormSchema>;

/**
 * Component representing the update order form.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.setUpdated - Callback function to set the updated order.
 * @returns {JSX.Element} - Update order form component.
 */
function UpdateOrderForm(props: FormWithSetUpdatedProps<Order>): React.JSX.Element {
	const navigate = useNavigate();
	const updateOrder = useUpdateOrder();
	const { toast } = useToast();

	const form = useForm<UpdateOrderFormValues>({
		resolver: zodResolver(updateOrderFormSchema),
		defaultValues: {
			oldOrderID: "",
			newPrice: "",
		},
	});

	const handleSubmit = async (values: UpdateOrderFormValues): Promise<void> => {
		try {
			const result = await updateOrder.mutateAsync({
				orderID: values.oldOrderID,
				order: { price: values.newPrice },
			});
			props.setUpdated(result);
			form.reset();
			toast({
				title: "Success",
				description: "Order updated successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to update order";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="oldOrderID"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Order ID</FormLabel>
							<FormControl>
								<Input placeholder="Current Order ID" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="newPrice"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Price</FormLabel>
							<FormControl>
								<Input placeholder="New Price" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={updateOrder.isPending}>
					{updateOrder.isPending ? "Updating..." : "Update Order"}
				</Button>
			</form>
		</Form>
	);
}

export { UpdateOrderForm };
