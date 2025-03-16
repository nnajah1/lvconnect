import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
import LVConnect from "../components/lv-connect";
import Button from "../components/button";

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
           // Navigate to reset password page after successful email submission
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] p-4">
        <LVConnect  />
      <div className="bg-[#fdfdfdd9] p-8 rounded-lg border border-[#BBBBBB] w-[470px] h-[420px] flex flex-col">
        <h2 className="text-2xl font-bold mt-3 mb-1">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email below to receive a password reset link.
        </p>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block text-sm text-[#3F3F3F] mt-5 mb-1 font-semibold">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            A password reset link will be sent to the email address you provided.
          </p>
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <Button type="submit" className="mt-15" fullWidth disabled={loading}>
               {loading ? "Sending..." : "Send Reset Link"}
            </Button>
        </form>
        <div className="w-full flex justify-center mt-5">
          <a href="/login" className="text-[#2CA4DD] text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
