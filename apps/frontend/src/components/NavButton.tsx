import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { NavButtonProps } from "../shared/types/components.types";

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

	const buttonStyle: React.CSSProperties = {
		backgroundColor: "#282c34",
		border: "none",
		color: "#ffffff",
		padding: "5px 20px", // Reduced vertical padding
		textAlign: "center",
		textDecoration: "none",
		display: "inline-block",
		fontSize: "16px",
		cursor: "pointer",
		borderRadius: "4px",
		transition: "all 0.3s ease",
	};

	const activeButtonStyle: React.CSSProperties = {
		...buttonStyle,
		backgroundColor: "#007BFF",
		color: "white",
	};

	return (
		<Link to={props.to}>
			<button
				style={isActive ? activeButtonStyle : buttonStyle}
				onMouseEnter={(e) =>
					!isActive && (e.currentTarget.style.backgroundColor = "#E0E0E0")
				}
				onMouseLeave={(e) =>
					!isActive && (e.currentTarget.style.backgroundColor = "transparent")
				}
			>
				<span>{props.label}</span> {/* Changed p tag to span */}
			</button>
		</Link>
	);
}

export default NavButton;

