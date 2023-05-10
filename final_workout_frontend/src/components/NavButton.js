import { NavLink, useResolvedPath, useMatch } from "react-router-dom";

/**
 * Component that provides a button that navigates to the given url when clicked, 
 * and which indicates whether it is on its active page or not.
 * 
 * @prop to: string with url to navigate to 
 * @prop label: label to use for the button.
 */
function NavButton(props) {
  let resolved = useResolvedPath(props.to);
  let match = useMatch({ path: resolved.pathname, end: true });

  const buttonStyle = {
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

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007BFF",
    color: "white",
  };

  const hoverButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#E0E0E0",
  };

  return (
    <NavLink to={props.to}>
      <button
        style={match ? activeButtonStyle : buttonStyle}
        onMouseEnter={(e) => !match && (e.target.style.backgroundColor = "#E0E0E0")}
        onMouseLeave={(e) => !match && (e.target.style.backgroundColor = "transparent")}
      >
        <span>{props.label}</span> {/* Changed p tag to span */}
      </button>
    </NavLink>
  );
}

export default NavButton;

