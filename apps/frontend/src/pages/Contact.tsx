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
		<div className="min-h-screen bg-background pb-24 pt-32">
			<div className="container">
				<div className="text-center mb-20 space-y-6">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-5xl md:text-7xl font-serif font-bold text-foreground"
					>
						Get in <span className="text-lime-500 italic">Touch</span>
					</motion.h1>
					<p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
						Have a question about your order or need advice on supplements? We're here to help.
					</p>
				</div>

				<div className="max-w-4xl mx-auto">
					{/* Contact Form & Info Combined */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<h2 className="text-3xl font-serif font-bold mb-8 text-foreground">Message Us</h2>
							<form className="space-y-6">
								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-2">
										<Input placeholder="First Name" />
									</div>
									<div className="space-y-2">
										<Input placeholder="Last Name" />
									</div>
								</div>
								<div className="space-y-2">
									<Input type="email" placeholder="Email Address" />
								</div>
								<div className="space-y-2">
									<Textarea placeholder="Your Message" className="min-h-[150px] resize-none" />
								</div>
								<Button className="w-full font-bold uppercase tracking-widest">
									Send Message
								</Button>
							</form>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
							className="space-y-16"
						>
							{/* Contact Details */}
							<div className="space-y-8">
								{[
									{ label: "Phone", value: "+1 (800) 267-2001" },
									{ label: "Email", value: "support@supplementshop.com" },
									{ label: "HQ", value: "123 Fitness Blvd, Austin, TX" }
								].map((item) => (
									<div key={item.label}>
										<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
										<p className="text-xl font-serif text-foreground">{item.value}</p>
									</div>
								))}
							</div>

							{/* FAQ Accordion */}
							<div className="space-y-6">
								<h3 className="text-xl font-serif font-bold text-foreground">F.A.Q.</h3>
								<Accordion type="single" collapsible className="w-full">
									{faqs.map((faq, index) => (
										<AccordionItem key={index} value={`item-${index}`} className="border-border">
											<AccordionTrigger className="text-base hover:text-lime-600 font-serif text-left py-4">{faq.question}</AccordionTrigger>
											<AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-6">{faq.answer}</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Contact;
