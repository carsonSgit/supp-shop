import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUser } from "../features/users/hooks/useUsers";
import { FormWithSetAddedProps } from "../shared/types/components.types";
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

const userFormSchema = z.object({
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

/**
 * Component that lets the user enter in the name, email and password of a new user
 * and then calls the backend to add it.
 * Side effect: passes the added user using setAdded
 * @returns JSX containing the form.
 */
function AddUserForm(props: FormWithSetAddedProps<User>): React.JSX.Element {
	const navigate = useNavigate();
	const createUser = useCreateUser();
	const { toast } = useToast();

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (values: UserFormValues): Promise<void> => {
		try {
			const result = await createUser.mutateAsync({
				username: values.username,
				email: values.email,
				password: values.password,
			});
			props.setAdded(result);
			form.reset();
			toast({
				title: "Success",
				description: "User created successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to add user";
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

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Password..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={createUser.isPending}>
					{createUser.isPending ? "Adding..." : "Add User"}
				</Button>
			</form>
		</Form>
	);
}
export { AddUserForm };
