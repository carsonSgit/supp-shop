import React from "react";
import { Link } from "@tanstack/react-router";
import { Separator } from "./ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { useTranslation } from "../shared/hooks/useTranslation";

/**
 * Component representing the footer section of the website.
 *
 * @returns {JSX.Element} - Footer component.
 */
function Footer(): React.JSX.Element {
	const t = useTranslation();
	
	return (
		<footer className="border-t bg-background">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Company Info */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>{t.footer.supplementShop}</CardTitle>
							<CardDescription>
								{t.footer.tagline}
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Quick Links */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>{t.footer.quickLinks}</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-2">
							<Link
								to="/"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{t.nav.home}
							</Link>
							<Link
								to="/about"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{t.nav.aboutUs}
							</Link>
							<Link
								to="/contact"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{t.nav.contact}
							</Link>
							<Link
								to="/products"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{t.nav.shop}
							</Link>
						</CardContent>
					</Card>

					{/* Customer Service */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>{t.footer.customerService}</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-2">
							<Link
								to="/orders"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{t.nav.orders}
							</Link>
							<Link
								to="/contact"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								{t.footer.support}
							</Link>
						</CardContent>
					</Card>

					{/* Contact Info */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>{t.footer.contact}</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-2">
							<p className="text-sm text-muted-foreground">
								{t.footer.email}: {t.footer.emailValue}
							</p>
							<p className="text-sm text-muted-foreground">
								{t.footer.phone}: {t.footer.phoneValue}
							</p>
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
					<p className="text-sm text-muted-foreground">
						{t.footer.copyright} {new Date().getFullYear()}. {t.footer.allRightsReserved}
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
