import React, { useState, useEffect } from "react";
import illustration from "../src/assets/illustration.jpg";
import logo from "../src/assets/lv-logo.png";

const Onetimepassword = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendVisible, setResendVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);

  useEffect(() => {
    fetchOtpTimer();
  }, []);

  const fetchOtpTimer = async () => {
    try {
      const response = await fetch("");
      const data = await response.json();
      setTimeLeft(data.timeLeft);
    } catch (error) {
      console.error("", error);
    }
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setResendVisible(true);
      setOtp(Array(6).fill(""));
    }
  }, [timeLeft]);

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

  const handleResend = async () => {
    try {
      const response = await fetch("", { method: "" });
      const data = await response.json();
      if (data.success) {
        setTimeLeft(data.timeLeft);
        setResendVisible(false);
        setOtp(Array(6).fill(""));
      }
    } catch (error) {
      console.error("", error);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await fetch("", {
        method: "",
        headers: { "": "" },
        body: JSON.stringify({ otp: otp.join("") }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("");
      } else {
        console.log("");
      }
    } catch (error) {
      console.error("", error);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <img src={illustration} alt="Background" className="absolute w-full h-full blur-[2px] object-cover" />

      <div className="relative bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-[620px] h-[450px] flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mb-4">
          <img src={logo} alt="LVConnect Logo" className="w-14 h-14 mr-2" />
          <h1 className="text-[20px] font-bold leading-[40px] text-[#1F3463]">
            <span className="text-[#36A9E1]">LV</span>
            <span className="text-[16px] leading-[24px] font-extrabold">Connect</span>
          </h1>
        </div>

        <h2 className="text-lg font-semibold mb-2">Authenticate your account</h2>
        <p className="text-sm text-gray-600 mb-4 text-center font-semibold">
          Please enter the One-Time Password (OTP) sent to the <br /> email address you provided.
        </p>

        <div className="flex justify-center space-x-2 mb-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              className={`w-11 h-13 m-2.5 text-center text-lg border rounded-lg focus:outline-none ${focusedIndex === index ? "border-black" : "border-gray-300"
                } ${resendVisible ? "bg-gray-100 cursor-not-allowed" : ""}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              disabled={resendVisible}
            />
          ))}
        </div>

        <div className="justify-end pr-24 text-sm text-gray-600 w-full flex mb-2">
          {resendVisible ? (
            <button onClick={handleResend} className="text-blue-500 font-semibold hover:underline">
              Resend OTP
            </button>
          ) : (
            <span>
              Resend OTP in <span className="text-red-500 font-semibold">{formatTime(timeLeft)}</span>
            </span>
          )}
        </div>

        <div className="ml-54 w-full my-3">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember this device. <a href="#" className="text-blue-500 underline">Learn more</a>
          </label>
        </div>

        <button
          onClick={handleVerify}
          className={`w-80 py-2 rounded-lg font-semibold ${isOtpComplete ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-[#85bbd4] text-white opacity-65 cursor-not-allowed"
            }`}
          disabled={!isOtpComplete}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Onetimepassword;
