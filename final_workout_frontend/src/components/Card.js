import "./Card.css";

/**
 * Component representing a card container.
 *
 * @param {ReactNode} children - The content to be rendered inside the card.
 * @returns {JSX.Element} - Card component.
 */
function Card({ children }) {
	return <div className="card">{children}</div>;
}

export default Card;
