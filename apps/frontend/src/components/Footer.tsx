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

/**
 * Component representing the footer section of the website.
 *
 * @returns {JSX.Element} - Footer component.
 */
function Footer(): React.JSX.Element {
	return (
		<footer className="border-t bg-background">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Company Info */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>Supplement Shop</CardTitle>
							<CardDescription>
								Your trusted source for quality supplements
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Quick Links */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>Quick Links</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-2">
							<Link
								to="/"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Home
							</Link>
							<Link
								to="/about"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								About Us
							</Link>
							<Link
								to="/contact"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Contact
							</Link>
							<Link
								to="/products"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Shop
							</Link>
						</CardContent>
					</Card>

					{/* Customer Service */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>Customer Service</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-2">
							<Link
								to="/orders"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Orders
							</Link>
							<Link
								to="/contact"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Support
							</Link>
						</CardContent>
					</Card>

					{/* Contact Info */}
					<Card className="border-0 shadow-none">
						<CardHeader>
							<CardTitle>Contact</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col space-y-2">
							<p className="text-sm text-muted-foreground">
								Email: support@supplementshop.com
							</p>
							<p className="text-sm text-muted-foreground">
								Phone: 1-800-SUPPLEMENTS
							</p>
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
					<p className="text-sm text-muted-foreground">
						© NAC Inc. {new Date().getFullYear()}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
