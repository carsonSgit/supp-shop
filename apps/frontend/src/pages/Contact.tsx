import React from "react";
import { useTranslation } from "../shared/hooks/useTranslation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Mail, Phone } from "lucide-react";

/**
 * Component representing the Contact Us page.
 *
 * @returns {JSX.Element} - Contact Us component.
 */
function Contact(): React.JSX.Element {
	const t = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl">
						{t.pages.contact.title}
					</CardTitle>
					<CardDescription>
						{t.pages.contact.subtitle}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Separator />
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<Phone className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									{t.pages.contact.phone}
								</p>
								<p className="text-lg font-semibold">+1(800) 267-2001</p>
							</div>
						</div>
						<Separator />
						<div className="flex items-center space-x-4">
							<Mail className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									{t.pages.contact.email}
								</p>
								<p className="text-lg font-semibold">
									nacsupplements@gmail.com
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Contact;
