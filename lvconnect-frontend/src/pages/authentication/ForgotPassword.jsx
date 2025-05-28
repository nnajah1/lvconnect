import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
import LVConnect from "@/components/ui/lv-connect";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import api from "@/services/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/send-reset-link', { email });

      toast.success(response.data.message);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || 'Something went wrong.');
      } else {
        toast.error('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-muted p-4">
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
}
