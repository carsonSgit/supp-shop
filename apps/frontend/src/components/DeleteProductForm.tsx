import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDeleteProduct } from "../features/products/hooks/useProducts";
import { FormWithSetDeletedProps } from "../shared/types/components.types";
import { Product } from "../api/types";
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

const deleteProductFormSchema = z.object({
	oldFlavour: z.string().min(1, "Flavour is required"),
});

type DeleteProductFormValues = z.infer<typeof deleteProductFormSchema>;

/**
 * Functionality for deleting a product according to given parameters.
 * Uses a DELETE request to update the product in the database.
 * @param {Object} props: the parameter of the product to be deleting.
 * @returns user-input field that holds a value for the product.
 */
function DeleteProductForm(props: FormWithSetDeletedProps<Product>): React.JSX.Element {
	const navigate = useNavigate();
	const deleteProduct = useDeleteProduct();
	const { toast } = useToast();

	const form = useForm<DeleteProductFormValues>({
		resolver: zodResolver(deleteProductFormSchema),
		defaultValues: {
			oldFlavour: "",
		},
	});

	const handleSubmit = async (values: DeleteProductFormValues): Promise<void> => {
		try {
			const productToDelete: Product = {
				flavour: values.oldFlavour,
				price: 0,
			};
			await deleteProduct.mutateAsync(productToDelete);
			props.setDeleted(productToDelete);
			form.reset();
			toast({
				title: "Success",
				description: "Product deleted successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to delete product";
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
					name="oldFlavour"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Product Flavour to Delete</FormLabel>
							<FormControl>
								<Input placeholder="Current Flavour..." {...field} />
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
							disabled={!form.watch("oldFlavour") || deleteProduct.isPending}
						>
							{deleteProduct.isPending ? "Deleting..." : "Delete Product"}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								product with flavour "{form.watch("oldFlavour")}".
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

export { DeleteProductForm };
