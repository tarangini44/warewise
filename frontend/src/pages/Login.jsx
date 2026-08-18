import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Boxes, Lock, User } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isLoggedIn =
    localStorage.getItem("warewise_logged_in") === "true";

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "warewise123") {
      localStorage.setItem("warewise_logged_in", "true");
      navigate("/", { replace: true });
      return;
    }

    setError("Invalid username or password.");
  };

  return (
    <div className="login-page">

      <div className="login-overlay"></div>

      <div className="login-card">

        <div className="login-logo">
          <Boxes size={34} />
        </div>

        <h1>WareWise</h1>

        <p className="login-subtitle">
          Smart Warehouse Management
        </p>

        <div className="login-heading">
          <h2>Warehouse Operations Portal</h2>
          <p>Sign in to access your warehouse command center.</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="login-field">

            <label>Username</label>

            <div className="login-input-wrapper">
              <User size={18} />

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

          </div>

          <div className="login-field">

            <label>Password</label>

            <div className="login-input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
          >
            SIGN IN
          </button>

        </form>

        <div className="login-demo">
          <span>Demo access</span>
          <p>Username: admin</p>
          <p>Password: warewise123</p>
        </div>

        <div className="login-footer">
          WAREWISE • Smart Warehouse Operations Platform
        </div>

      </div>

    </div>
  );
}

export default Login;