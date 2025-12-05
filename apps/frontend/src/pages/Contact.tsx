import React from "react";
import { useTranslation } from "../shared/hooks/useTranslation";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../components/ui/accordion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact(): React.JSX.Element {
	const t = useTranslation();

	const faqs = [
		{ question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries worldwide with tracked shipping." },
		{ question: "Are your products vegan?", answer: "Most of our range is vegan-friendly. Check the product label for specific details." },
		{ question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee on all unopened products." },
	];

	return (
		<div className="min-h-screen bg-background pb-20 pt-24">
			<div className="container">
				<div className="text-center mb-16 space-y-4">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight italic"
					>
						Get in <span className="text-primary">Touch</span>
					</motion.h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Have a question about your order or need advice on supplements? We're here to help.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="border-border/50 shadow-lg">
							<CardHeader>
								<CardTitle className="text-2xl">Send us a message</CardTitle>
							</CardHeader>
							<CardContent>
								<form className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-sm font-medium">First Name</label>
											<Input placeholder="John" />
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium">Last Name</label>
											<Input placeholder="Doe" />
										</div>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Email</label>
										<Input type="email" placeholder="john@example.com" />
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Message</label>
										<Textarea placeholder="How can we help you?" className="min-h-[150px]" />
									</div>
									<Button className="w-full font-bold uppercase" size="lg">
										Send Message <Send className="ml-2 h-4 w-4" />
									</Button>
								</form>
							</CardContent>
						</Card>
					</motion.div>

					{/* Contact Info & FAQ */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="space-y-8"
					>
						{/* Info Cards */}
						<div className="grid gap-4">
							<Card className="bg-secondary/5 border-border/50">
								<CardContent className="flex items-center p-6 space-x-4">
									<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
										<Phone className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Phone</p>
										<p className="text-lg font-bold">+1 (800) 267-2001</p>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-secondary/5 border-border/50">
								<CardContent className="flex items-center p-6 space-x-4">
									<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
										<Mail className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">Email</p>
										<p className="text-lg font-bold">support@supplementshop.com</p>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-secondary/5 border-border/50">
								<CardContent className="flex items-center p-6 space-x-4">
									<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
										<MapPin className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">HQ</p>
										<p className="text-lg font-bold">123 Fitness Blvd, Austin, TX</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* FAQ Accordion */}
						<div className="space-y-4">
							<h3 className="text-xl font-bold">Frequently Asked Questions</h3>
							<Accordion type="single" collapsible className="w-full">
								{faqs.map((faq, index) => (
									<AccordionItem key={index} value={`item-${index}`}>
										<AccordionTrigger>{faq.question}</AccordionTrigger>
										<AccordionContent>{faq.answer}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default Contact;
