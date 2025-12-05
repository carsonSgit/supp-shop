import Card from "./Card";

/**
 * Component to display a given user
 * @props {Object} user: user to display containing name and type fields.
 * @props {string} heading: string describing the user to display.
 */
function DisplayUser(props) {
	return (
		<>
			<Card>
				{/* Display the user */}
				<h1>{props.heading}</h1>
				<h2>Username: {props.user.username}</h2>
				<h2>Email: {props.user.email}</h2>
			</Card>
		</>
	);
}

export { DisplayUser };
