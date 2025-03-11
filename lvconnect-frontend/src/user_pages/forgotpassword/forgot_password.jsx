import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
import LVConnect from "../../components/lv-connect";
import Button from "../../components/button";
import "../forgotpassword/forgot_password.css"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("", {
        method: "",
        headers: {
          "": "",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("");
        // navigate("/reset-password"); 
      } else {
        setError(data.message || "");
      }
    } catch (err) {
      setError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <LVConnect />
      <div className="forgot-password-box">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="forgot-password-text">
          Enter your email below to receive a password reset link.
        </p>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <label className="forgot-password-label">Email address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="forgot-password-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="forgot-password-info">
            A password reset link will be sent to the email address you provided.
          </p>
          {message && <p className="forgot-password-message">{message}</p>}
          {error && <p className="forgot-password-error">{error}</p>}

          <Button type="submit" className="forgot-password-button" fullWidth disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        <div className="forgot-password-back">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
