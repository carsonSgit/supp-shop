import React from "react";
import "./Card.css";
import { CardProps } from "../shared/types/components.types";

/**
 * Component representing a card container.
 *
 * @param {ReactNode} children - The content to be rendered inside the card.
 * @returns {JSX.Element} - Card component.
 */
function Card({ children }: CardProps): React.JSX.Element {
	return <div className="card">{children}</div>;
}

export default Card;

