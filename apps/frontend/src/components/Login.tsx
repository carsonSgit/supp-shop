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
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-md mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">{t.pages.login.title}</CardTitle>
					<CardDescription>
						{t.pages.login.subtitle}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<LoginForm setAdded={setAdded as (result: LoginResponse) => void} />
					{(added as User).username && (
						<>
							<Separator />
							<DisplayUser user={added as User} heading={t.pages.login.loggedInAs} />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export { Login };
