import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateUser } from "../features/users/hooks/useUsers";
import { FormWithSetUpdatedProps } from "../shared/types/components.types";
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
import { useToast } from "./ui/use-toast";

const updateUserFormSchema = z.object({
	oldUsername: z.string().min(1, "Current username is required"),
	newUsername: z.string().min(1, "New username is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

/**
 * Component that lets the user enter in the old and new username and email and password
 * of a user and then calls the backend to change it.
 *
 * @props {function} setUpdated: To pass back the changed user by side-effect
 * @returns  JSX containing the form.
 */
function UpdateUserForm(props: FormWithSetUpdatedProps<User>): React.JSX.Element {
	const navigate = useNavigate();
	const updateUser = useUpdateUser();
	const { toast } = useToast();

	const form = useForm<UpdateUserFormValues>({
		resolver: zodResolver(updateUserFormSchema),
		defaultValues: {
			oldUsername: "",
			newUsername: "",
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (values: UpdateUserFormValues): Promise<void> => {
		try {
			const result = await updateUser.mutateAsync({
				username: values.oldUsername,
				user: {
					username: values.newUsername,
					email: values.email,
					password: values.password,
				},
			});
			props.setUpdated(result);
			form.reset();
			toast({
				title: "Success",
				description: "User updated successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to update user";
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
					name="oldUsername"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Username</FormLabel>
							<FormControl>
								<Input placeholder="Current Username..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="newUsername"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Username</FormLabel>
							<FormControl>
								<Input placeholder="New Username..." {...field} />
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
							<FormLabel>New Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="New Email..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="New Password..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={updateUser.isPending}>
					{updateUser.isPending ? "Updating..." : "Update User"}
				</Button>
			</form>
		</Form>
	);
}

export { UpdateUserForm };
