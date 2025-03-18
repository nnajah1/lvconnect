import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/ui/button";
import preventBackNavigation from "../../utils/preventBackNavigation";


import LVConnect from "@/components/ui/lv-connect";

import illustration from "@/assets/illustration.jpg";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../../components/ui/input-otp";

const OTPVerification = () => {
    preventBackNavigation(true);

    const location = useLocation();
    const navigate = useNavigate();
    const { sendOTP, verifyOTP, setTimer, timer, user, isResendDisabled, setIsResendDisabled } = useAuthContext();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);

    // Retrieve userId, deviceId, and deviceName from the location state
    const { userId, } = location.state || {};

    // Check if OAuth user
    const isOAuth = location.state?.isOAuth || false;

    // Redirect to login if accessed directly
    useEffect(() => {
        if (!user && !userId) {
            navigate("/login", { replace: true });
        } else if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [userId, user, navigate]);



    useEffect(() => {
        const startTime = localStorage.getItem("otpStartTime");
        if (startTime) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const remainingTime = Math.max(120 - elapsedTime, 0); // Adjust for elapsed time
            setTimer(remainingTime);
        } else {
            setTimer(120); // Default if no previous timer
        }
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setIsResendDisabled(false);
        }
    }, [timer]);

    // Restrict OTP input to only numbers (digits 0-9)
    const handleOtpChange = (value) => {
        const numericValue = value.replace(/\D/g, ""); // Remove non-digit characters
        setOtp(numericValue);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError(null);
        if (!userId) {
            setError("Invalid request. Please try again.");
            return;
        }
        if (!otp) {
            setError("invalid OTP. Please Try again.");
            return;
        }
        try {

            const response = await verifyOTP(location.state.userId, otp, location.state.rememberDevice, isOAuth);

            if (response.success) {
                //Redirect to Change Password if password must change
                if (response.mustChangePassword) {
                    navigate("/change-password", { state: { userId: response.userId }, replace: true });
                } else {
                    navigate("/dashboard", { replace: true });
                }
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError("OTP verification failed");
        }
    }

    const handleResendOTP = async () => {
        try {
            const response = await sendOTP(userId, "unrecognized_device"); // Call API to resend OTP

            if (response.success) {
                alert("A new OTP has been sent to your email.");
                setTimer(5); // Restart the timer (assuming 120 seconds)
                localStorage.setItem("otpStartTime", Date.now()); // Save new start time
                setIsResendDisabled(true);

            } else {
                throw new Error(response.message || "Failed to resend OTP. Please try again.");
            }
        } catch (error) {
            console.error("Resend OTP failed:", error);
            alert(error.message);
        }
    };

    // Format timer (MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            <img src={illustration} alt="Background" className="absolute w-full h-full blur-[2px] object-cover" />

            <div className="relative bg-white/70 backdrop-blur-sm rounded-lg shadow-lg w-[580px] h-[450px] flex flex-col justify-center items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center items-center mb-2">
                        <LVConnect />
                    </div>

                    <h2 className="text-lg font-semibold mb-2">Authenticate your account</h2>
                    <p className="text-sm text-gray-600 mb-4 text-center font-semibold">
                        Please enter the One-Time Password (OTP) sent to the <br /> email address you provided.
                    </p>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <div className="flex justify-center space-x-2 mb-2">
                        <InputOTP maxLength={6} value={otp}
                            onChange={handleOtpChange} className="mb-4">
                            <InputOTPGroup>
                                {[...Array(6)].map((_, index) => (
                                    <InputOTPSlot key={index} index={index} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div className=" text-sm text-gray-600 w-full flex justify-end mb-2 pr-4">
                        {isResendDisabled ? (
                            <span>
                                Resend OTP in <span className="text-red-500 font-semibold">{formatTime(timer)}</span>
                            </span>
                        ) : (
                            <button onClick={handleResendOTP} disabled={isResendDisabled}
                                className="text-blue-500 font-semibold hover:underline">
                                Resend OTP
                            </button>
                        )}
                    </div>


                    <Button onClick={handleVerifyOTP} className=" w-[90%] mt-2">Verify</Button>
                </div>
            </div>
        </div>
    );

};

export default OTPVerification;
