import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useCookies } from "react-cookie";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

interface AboutSearchParams {
	employee?: string;
	[key: string]: unknown;
}

/**
 * Component representing the About page.
 *
 * @returns {JSX.Element} - About component.
 */
function About(): React.JSX.Element {
	const search = useSearch({ strict: false }) as AboutSearchParams;
	const employee = search?.employee;
	const [cookies] = useCookies(["lang"]);

	const isEnglish = cookies.lang === "EN" || !cookies.lang;

	const employees = [
		{
			name: "Noah",
			description: isEnglish
				? "Noah is a great coder who loves the gym"
				: "Noah est un excellent codeur qui aime la gym",
		},
		{
			name: "Carson",
			description: isEnglish
				? "Carson is the resident scribe"
				: "Carson est le scribe résident",
		},
		{
			name: "Alejandro",
			description: isEnglish
				? "Alejandro is talking to the voices"
				: "Alejandro parle aux voix dans sa tete",
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl">
						{isEnglish ? "About Us" : "À propos de nous"}
					</CardTitle>
					<CardDescription className="text-lg">
						{isEnglish
							? "Our Temporary unpaid interns"
							: "Nos stagiaires temporaires non rémunérés"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Separator />
					<div className="grid gap-4 md:grid-cols-3">
						{employees.map((emp) => (
							<Card
								key={emp.name}
								className={
									employee === emp.name
										? "border-primary border-2"
										: ""
								}
							>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>{emp.name}</CardTitle>
										{employee === emp.name && (
											<Badge variant="default">Selected</Badge>
										)}
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										{emp.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default About;
