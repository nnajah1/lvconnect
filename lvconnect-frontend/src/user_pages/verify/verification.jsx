import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // need to install first to navigate 'npm install react-router-dom'
import Imagebackground from "../../components/background";
import LVConnect from "../../components/lv-connect";
import Button from "../../components/button";
import illustration from "../../assets/illustration.jpg";
import "./verification.css";

const Verification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const [otpExpiry, setOtpExpiry] = useState(300);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const resendInterval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const expiryInterval = setInterval(() => {
      setOtpExpiry((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(resendInterval);
      clearInterval(expiryInterval);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtpExpiry(300);
    setOtp(Array(6).fill(""));
  };

  const handleVerify = () => {
    if (otpExpiry === 0) {
      console.log("OTP expired. Request a new one.");
      return;
    }
    console.log("Verifying OTP:", otp.join(""));
    // navigate("/reset_password"); // Need to install first
  };

  return (
    <div className="verification-container">
      <Imagebackground src={illustration} alt="illustration" className="absolute" />
      <div className="verification-box">
        <LVConnect />
        <h2 className="verification-title">Authenticate your account</h2>
        <p className="verification-subtitle">
          Please enter the One-Time Password (OTP) sent to your email.
        </p>

        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              className={`otp-input ${isFocused ? "focused" : ""} ${
                otpExpiry === 0 ? "expired" : ""
              }`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={otpExpiry === 0}
            />
          ))}
        </div>

        <div className="resend-container">
          {resendTimer > 0 ? (
            <span>
              Resend OTP in <span className="resend-timer">{formatTime(resendTimer)}</span>
            </span>
          ) : (
            <button onClick={handleResend} className="resend-button">
              Resend OTP
            </button>
          )}
        </div>

        <Button
          onClick={handleVerify}
          size="md"
          className="verify-button"
          disabled={otp.some((d) => d === "") || otpExpiry === 0}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default Verification;
