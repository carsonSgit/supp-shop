import { useSearch } from "@tanstack/react-router";
import Alert from "react-bootstrap/Alert";
import { useCookies } from "react-cookie";

function Home() {
	const search = useSearch({ strict: false });
	const [cookies] = useCookies(["lang"]);

	return (
		<div lang={cookies.lang}>
			{cookies.lang === "EN" ? (
				<>
					{" "}
					<h1>Welcome to NAC Supplements</h1>{" "}
					<h2>Hello {search?.name || ""}</h2>{" "}
				</>
			) : (
				<>
					{" "}
					<h1>Bienvenue à CAN Suppléments</h1>{" "}
					<h2>Bonjour {search?.name || ""}</h2>{" "}
				</>
			)}

			{search?.errorMessage && (
				<Alert variant="danger">{search.errorMessage}</Alert>
			)}
		</div>
	);
}

export default Home;
