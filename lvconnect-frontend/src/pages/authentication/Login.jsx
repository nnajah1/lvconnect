
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

import LVConnect from "@/components/ui/lv-connect";
import Imagebackground from "@/components/ui/background";
import illustration from "@/assets/illustration.jpg";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa6";
import { IoLockClosed } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "@/styles/login.css";
import { toast } from "react-toastify";


export default function Login() {

  const { login, handleGoogleLogin, setTimer, setIsResendDisabled } = useAuthContext();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submitting again if already in progress
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setButtonLoading(true);

    const response = await login(credentials, rememberDevice);

    if (!response.success) {
      if (response.otpRequired) {
        setTimer(120); // Start the timer immediately
        localStorage.setItem("otpStartTime", Date.now()); // Save timer start time
        setIsResendDisabled(true);
        navigate("/otp", {

          state: {
            userId: response.userId, // Send userId to OTP page
            rememberDevice
          }
        });
      } else if (response.mustChangePassword) {
        navigate("/change-password", {
          state: { userId: response.userId }
        });
      }
      
      else {
        toast.error(response.message || "Login failed.");
      }
  
    } else {
      navigate("/"); 
    }
    setIsSubmitting(false);
    setButtonLoading(false);
  };


  return (
    <div className="login-container">
     <div className="image-background">
    <Imagebackground src={illustration} alt="illustration" />
  </div>
      <div className="login-card">
        <div className="login-header">
          <LVConnect />

        </div>

        <h2 className="login-subtitle">Sign in to your account to continue.</h2>

        {/* <div>{error && <p style={{ color: "red" }}>{error}</p>} */}
          <form className="login-form" onSubmit={handleSubmit}>

            <div className="grid gap-3">
              <div className="grid gap-3">
                <label className="login-label">Email address</label>
                <div className="input-group">
                  {/* <FaUser className="input-icon" /> */}
                  <input
                    className="input-field"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <label className="login-label">Password</label>
                <div className="input-group">
                  {/* <IoLockClosed className="input-icon" /> */}
                  <input
                    className="input-field"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right">
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                <a href="/forgot-password" className="forgot-password">
                  Forgot your password?
                </a>
              </div>

              <div className="mt-5">
                <Button type="submit" className="w-full cursor-pointer" disabled={buttonLoading}>
                  {buttonLoading ? "logging in..." : "Login"}
                </Button>
              </div>

              <div className="or-divider">
                <hr className="divider-line" />
                <span className="or-text">OR</span>
                <hr className="divider-line" />
              </div>


            </div>

          </form>

          <div>
            <button onClick={handleGoogleLogin} variant="outline" className="google-signin-btn">
              <FcGoogle className="google-icon" />
              Login with Google
            </button>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={() => {
                const newValue = !rememberDevice;
                setRememberDevice(newValue);
                localStorage.setItem("remember_device", JSON.stringify(newValue)); // Store as a boolean
              }}
              className="w-4 h-4 cursor-pointer"
            />
            <span className=" -translate-y-2 ">Remember this device. <a href="#" className="text-blue-500 underline">Learn more</a></span>
          </div>
          <p className="terms-text">
          {/* <a href="#" className="underline">Terms of Use</a> and */}
           <a href="/privacy-policy" target="_blank"
          rel="noopener noreferrer" className="underline">Privacy Statement</a>
        </p>
        </div>

        
      </div>
  );

};
