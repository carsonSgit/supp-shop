import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDeleteUser } from "../features/users/hooks/useUsers";
import { FormWithSetDeletedProps } from "../shared/types/components.types";
import { User } from "../api/types";
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

const deleteUserFormSchema = z.object({
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
});

type DeleteUserFormValues = z.infer<typeof deleteUserFormSchema>;

/**
 * Component that lets the user enter in the name, email of a user
 * and then calls the backend to delete it.
 * Side effect: passes the deleted user using setDeleted
 * @returns JSX containing the form.
 */
function DeleteUserForm(props: FormWithSetDeletedProps<User>): React.JSX.Element {
	const navigate = useNavigate();
	const deleteUser = useDeleteUser();
	const { toast } = useToast();

	const form = useForm<DeleteUserFormValues>({
		resolver: zodResolver(deleteUserFormSchema),
		defaultValues: {
			username: "",
			email: "",
		},
	});

	const handleSubmit = async (values: DeleteUserFormValues): Promise<void> => {
		try {
			await deleteUser.mutateAsync(values.username);
			props.setDeleted({ username: values.username, email: values.email });
			form.reset();
			toast({
				title: "Success",
				description: "User deleted successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to delete user";
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
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Username..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Email..." {...field} />
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
							disabled={
								!form.watch("username") ||
								!form.watch("email") ||
								deleteUser.isPending
							}
						>
							{deleteUser.isPending ? "Deleting..." : "Delete User"}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete user
								"{form.watch("username")}".
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
export { DeleteUserForm };
