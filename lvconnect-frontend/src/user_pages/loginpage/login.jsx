import { useState } from "react";
// import { useNavigate } from "react-router-dom"; //need to install first to navigate 'npm install react-router-dom'
import LVConnect from "../../components/lv-connect";
import Imagebackground from "../../components/ui/background";
import illustration from "../../assets/illustration.jpg";
import Button from "../../components/button";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa6";
import { IoLockClosed } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../loginpage/login.css";

function Login() {
  // const navigate = useNavigate(); // Commented out for now
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setIsInvalid(false);

    try {
      const response = await fetch(``, {
        method: "",
        headers: { "": "" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Incorrect credentials.");
        setIsInvalid(true);
        return;
      }

      // Store "Remember Device" in localStorage if checked
      if (rememberDevice) {
        localStorage.setItem("rememberDevice", "true");
      }

      // Commented out navigation for now
      // navigate("/dashboard");
    } catch (err) {
      setError("Incorrect credentials. Please try again.");
      setIsInvalid(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      setTimeout(() => {
        if (rememberDevice) {
          localStorage.setItem("rememberDevice", "true");
        }
        // Commented out navigation for now
        // navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Imagebackground src={illustration} alt="illustration" className="absolute" />
      <div className="login-card">
        <div className="login-header">
          <LVConnect />
        </div>

        <h2 className="login-subtitle">Sign in to your account to continue.</h2>

        <form onSubmit={onSubmit} className="login-form">
          <div>
            <label className="login-label">Email address</label>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className={`input-field ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div>
            <label className="login-label">Password</label>
            <div className="input-group">
              <IoLockClosed className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={credentials.password}
                onChange={handleChange}
                className={`input-field ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right">
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-red-500 text-sm">{error}</p>
              <a href="/forgot-password" className="forgot-password">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </Button>
        </form>

        <div className="or-divider">
          <hr className="divider-line" />
          <span className="or-text">OR</span>
          <hr className="divider-line" />
        </div>

        <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <FcGoogle className="google-icon" /> {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <div className="remember-me">
          <input type="checkbox" id="remember" checked={rememberDevice} onChange={() => setRememberDevice(!rememberDevice)} />
          <label htmlFor="remember">
            Remember this device. <a href="#" className="text-blue-500 underline">Learn more</a>
          </label>
        </div>

        <p className="terms-text">
          <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Statement</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
