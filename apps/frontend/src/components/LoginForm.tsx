import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "../api/auth";
import { LoginResponse } from "../api/types";
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

interface LoginFormProps {
	setAdded: (result: LoginResponse) => void;
}

const loginFormSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * Component representing the login form.
 *
 * @param {Object} props - Component props.
 * @param {function} props.setAdded - Function to update the added user.
 * @returns {JSX.Element} - Login form component.
 */
function LoginForm(props: LoginFormProps): React.JSX.Element {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	/** Handler method that makes the fetch request based on the form values */
	const handleSubmit = async (values: LoginFormValues): Promise<void> => {
		setIsLoading(true);
		try {
			const result = await authApi.login({
				username: values.username,
				password: values.password,
			});
			props.setAdded(result);
			toast({
				title: "Login successful",
				description: "Welcome back!",
			});
			navigate({ to: "/" });
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Login failed";
			toast({
				title: "Login failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6 w-full max-w-md mx-auto"
			>
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

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
			</form>
		</Form>
	);
}

export { LoginForm };
