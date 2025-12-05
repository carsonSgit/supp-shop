import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDeleteOrder } from "../features/orders/hooks/useOrders";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useToast } from "./ui/use-toast";

const deleteOrderFormSchema = z.object({
	OrderID: z.string().min(1, "Order ID is required"),
});

type DeleteOrderFormValues = z.infer<typeof deleteOrderFormSchema>;

/**
 * Component representing the form for deleting an order.
 *
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.setAdded - Function to set the added order.
 * @returns {JSX.Element} - DeleteOrderForm component.
 */
function DeleteOrderForm(props: FormWithSetAddedProps<Order>): React.JSX.Element {
	const navigate = useNavigate();
	const deleteOrder = useDeleteOrder();
	const { toast } = useToast();

	const form = useForm<DeleteOrderFormValues>({
		resolver: zodResolver(deleteOrderFormSchema),
		defaultValues: {
			OrderID: "",
		},
	});

	const handleSubmit = async (values: DeleteOrderFormValues): Promise<void> => {
		try {
			await deleteOrder.mutateAsync(values.OrderID);
			props.setAdded({
				orderID: values.OrderID,
				username: "",
				flavour: "",
				quantity: 0,
			});
			form.reset();
			toast({
				title: "Success",
				description: "Order deleted successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to delete order";
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
					name="OrderID"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Order ID</FormLabel>
							<FormControl>
								<Input placeholder="Current Order ID" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							type="button"
							variant="destructive"
							disabled={!form.watch("OrderID") || deleteOrder.isPending}
						>
							{deleteOrder.isPending ? "Deleting..." : "Delete Order"}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete order
								"{form.watch("OrderID")}".
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={form.handleSubmit(handleSubmit)}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</form>
		</Form>
	);
}

export { DeleteOrderForm };
