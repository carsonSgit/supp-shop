import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Component representing the login form.
 *
 * @param {Object} props - Component props.
 * @param {function} props.setAdded - Function to update the added user.
 * @returns {JSX.Element} - Login form component.
 */
function LoginForm(props) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const navigate = useNavigate();

  /** Handler method that makes the fetch request based on the form values */
  const handleSubmit = async (event) => {
    event.preventDefault();

    /** Options that indicate a post request passed in JSON body */
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch(
      "http://localhost:1339/session/login",
      requestOptions
    );
    const result = await response.json();
    if (response.status === 401 || response.status === 500) {
      navigate("/", { state: { errorMessage: result.errorMessage } });
    } else {
      props.setAdded(result);
      if (response.status === 200) {
        navigate("/");
      }
    }
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username..."
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
      />

      {username && password && <button type="submit">Login</button>}
    </form>
  );
}

export { LoginForm };
