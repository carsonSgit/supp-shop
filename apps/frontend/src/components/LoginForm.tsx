import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../features/auth/context/AuthContext";
import { useTranslation } from "../shared/hooks/useTranslation";
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
	setAdded?: (result: { username: string }) => void;
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
	const { login } = useAuth();
	const t = useTranslation();
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
			await login(values.username, values.password);
			if (props.setAdded) {
				props.setAdded({ username: values.username });
			}
			toast({
				title: t.pages.login.loginSuccessful,
				description: t.pages.login.welcomeBack,
			});
			navigate({ to: "/" });
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				t.pages.login.loginFailed;
			toast({
				title: t.pages.login.loginFailed,
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
							<FormLabel className="font-bold text-gray-700 uppercase tracking-widest text-xs">{t.forms.username}</FormLabel>
							<FormControl>
								<Input
									placeholder={`${t.forms.username}...`}
									className="h-12 bg-gray-50 border-gray-100 focus:border-lime-500 rounded-xl transition-all"
									{...field}
								/>
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
							<FormLabel className="font-bold text-gray-700 uppercase tracking-widest text-xs">{t.forms.password}</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={`${t.forms.password}...`}
									className="h-12 bg-gray-50 border-gray-100 focus:border-lime-500 rounded-xl transition-all"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full h-12 rounded-xl text-lg font-bold uppercase tracking-wider bg-[#1a1a1a] hover:bg-lime-500 hover:text-[#1a1a1a] transition-colors shadow-lg"
					disabled={isLoading}
				>
					{isLoading ? t.pages.login.loggingIn : t.nav.login}
				</Button>
			</form>
		</Form>
	);
}

export { LoginForm };
