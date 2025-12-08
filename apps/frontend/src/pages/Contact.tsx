import React from "react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

function Contact(): React.JSX.Element {
	return (
		<div className="min-h-screen bg-background flex flex-col lg:flex-row">
			{/* Left Column - Form */}
			<div className="w-full lg:w-1/2 p-8 lg:p-24 flex items-center justify-center">
				<div className="w-full max-w-xl space-y-8">
					<div className="space-y-4">
						<h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
							We're here to help you perform.
						</h1>
						<p className="text-muted-foreground text-lg">
							Questions about products or your order? Email us at <span className="text-primary font-medium">support@suppshop.com</span>
						</p>
					</div>

					<form className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="firstName">First name *</Label>
								<Input id="firstName" placeholder="First name" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last name *</Label>
								<Input id="lastName" placeholder="Last name" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input id="email" type="email" placeholder="you@example.com" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone number</Label>
							<div className="flex">
								<select className="flex h-10 w-[80px] rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-r-0">
									<option>US</option>
									<option>CA</option>
									<option>UK</option>
								</select>
								<Input className="rounded-l-none" placeholder="+1 (555) 000-0000" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Message *</Label>
							<Textarea
								id="message"
								placeholder="How can we help you reach your goals?"
								className="min-h-[150px] resize-none"
							/>
						</div>

						<div className="space-y-4">
							<Label>Topic</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center space-x-2">
									<Checkbox id="order-status" />
									<Label htmlFor="order-status" className="font-normal">Order Status</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="product-advice" />
									<Label htmlFor="product-advice" className="font-normal">Product Advice</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="returns" />
									<Label htmlFor="returns" className="font-normal">Returns</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="wholesale" />
									<Label htmlFor="wholesale" className="font-normal">Wholesale</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="partnership" />
									<Label htmlFor="partnership" className="font-normal">Partnership</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox id="other" />
									<Label htmlFor="other" className="font-normal">Other</Label>
								</div>
							</div>
						</div>

						<Button className="w-full bg-primary h-12 text-lg font-medium" size="lg">
							Send Message
						</Button>
					</form>
				</div>
			</div>

			{/* Right Column - Image */}
			<div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop"
					alt="Athlete training in gym"
					className="absolute inset-0 w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}

export default Contact;
