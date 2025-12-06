import React from "react";
import { LoginForm } from "./LoginForm";
import { DisplayUser } from "./DisplayUser";
import { useState } from "react";
import { LoginResponse, User } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Separator } from "./ui/separator";
import { useTranslation } from "../shared/hooks/useTranslation";

/**
 * Component representing the login page.
 *
 * @returns {JSX.Element} - Login component.
 */
function Login(): React.JSX.Element {
	const [added, setAdded] = useState<User | LoginResponse>({} as User);
	const t = useTranslation();

	return (
		<div className="container mx-auto px-4 py-32 flex items-center justify-center min-h-[60vh]">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">{t.pages.login.title}</h1>
					<p className="text-muted-foreground">{t.pages.login.subtitle}</p>
				</div>

				<div className="bg-white p-8 rounded-3xl shadow-2xl shadow-gray-200/50">
					<LoginForm setAdded={setAdded as (result: LoginResponse) => void} />
					{(added as User).username && (
						<div className="mt-6 pt-6 border-t border-gray-100">
							<DisplayUser user={added as User} heading={t.pages.login.loggedInAs} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export { Login };
