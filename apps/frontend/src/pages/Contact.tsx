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
		<div className="min-h-screen bg-[#fafafa] pb-24 pt-32">
			<div className="container">
				<div className="text-center mb-20 space-y-6">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-5xl md:text-7xl font-serif font-bold text-[#1a1a1a]"
					>
						Get in <span className="text-lime-500 italic">Touch</span>
					</motion.h1>
					<p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
						Have a question about your order or need advice on supplements? We're here to help.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-gray-200/50"
					>
						<h2 className="text-3xl font-serif font-bold mb-8">Send us a message</h2>
						<form className="space-y-6">
							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-bold text-gray-700 uppercase tracking-wider">First Name</label>
									<Input placeholder="John" className="h-12 bg-gray-50 border-gray-100 focus:border-lime-500 rounded-xl" />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
									<Input placeholder="Doe" className="h-12 bg-gray-50 border-gray-100 focus:border-lime-500 rounded-xl" />
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email</label>
								<Input type="email" placeholder="john@example.com" className="h-12 bg-gray-50 border-gray-100 focus:border-lime-500 rounded-xl" />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Message</label>
								<Textarea placeholder="How can we help you?" className="min-h-[150px] bg-gray-50 border-gray-100 focus:border-lime-500 rounded-xl resize-none" />
							</div>
							<Button className="w-full font-bold uppercase bg-[#1a1a1a] hover:bg-lime-500 hover:text-[#1a1a1a] h-14 rounded-xl text-lg shadow-lg" size="lg">
								Send Message <Send className="ml-2 h-5 w-5" />
							</Button>
						</form>
					</motion.div>

					{/* Contact Info & FAQ */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="space-y-12"
					>
						{/* Info Cards */}
						<div className="grid gap-6">
							{[
								{ icon: Phone, label: "Phone", value: "+1 (800) 267-2001" },
								{ icon: Mail, label: "Email", value: "support@supplementshop.com" },
								{ icon: MapPin, label: "HQ", value: "123 Fitness Blvd, Austin, TX" }
							].map((item) => (
								<div key={item.label} className="flex items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-lime-200 transition-colors">
									<div className="h-14 w-14 rounded-2xl bg-lime-50 flex items-center justify-center text-lime-600 mr-6">
										<item.icon className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
										<p className="text-xl font-serif font-bold text-[#1a1a1a]">{item.value}</p>
									</div>
								</div>
							))}
						</div>

						{/* FAQ Accordion */}
						<div className="space-y-6">
							<h3 className="text-2xl font-serif font-bold">Frequently Asked Questions</h3>
							<Accordion type="single" collapsible className="w-full">
								{faqs.map((faq, index) => (
									<AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
										<AccordionTrigger className="text-lg font-medium hover:text-lime-600 font-serif">{faq.question}</AccordionTrigger>
										<AccordionContent className="text-gray-500 text-base leading-relaxed">{faq.answer}</AccordionContent>
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
