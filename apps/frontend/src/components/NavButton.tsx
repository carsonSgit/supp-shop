import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { NavButtonProps } from "../shared/types/components.types";
import { cn } from "../lib/utils";

/**
 * Component that provides a button that navigates to the given url when clicked,
 * and which indicates whether it is on its active page or not.
 *
 * @prop to: string with url to navigate to
 * @prop label: label to use for the button.
 */
function NavButton(props: NavButtonProps): React.JSX.Element {
	const router = useRouterState();
	const currentPath = router.location.pathname;
	const isActive = currentPath === props.to;

	return (
		<Link to={props.to}>
			<Button
				variant={isActive ? "secondary" : "ghost"}
				className={cn(
					"transition-colors",
					isActive && "bg-accent text-accent-foreground",
				)}
			>
				{props.label}
			</Button>
		</Link>
	);
}

export default NavButton;
