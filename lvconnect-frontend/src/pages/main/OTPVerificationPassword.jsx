import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import preventBackNavigation from "../utils/preventBackNavigation";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "../components/ui/input-otp";

const OTPVerification = () => {
   

    const location = useLocation();
    const navigate = useNavigate();
    const {sendOTP, verifyOTP, setTimer, timer, user } = useAuthContext();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    // Retrieve userId, deviceId, and deviceName from the location state
    const { userId, deviceId, deviceName } = location.state || {};
    
    // Redirect to login if accessed directly
    useEffect(() => {
        if ( !user && !userId) {
            navigate("/login", { replace: true });
        } else if (user) {
            navigate("/", { replace: true });
        }
    }, [userId, user, navigate]); 

    preventBackNavigation(true);

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
        
        if (!userId || !deviceId || !deviceName) {
            setError("Invalid request. Please try again.");
            return;
        }
        if (!otp) {
            setError("invalid OTP. Please Try again.");
            return;
        }
    

        const response = await verifyOTP(location.state.userId, otp, deviceId, deviceName);

        if (response.success) {
            //Redirect to Change Password if password must change
            if (response.mustChangePassword) {
                navigate("/change-password", { state: { userId: response.userId }, replace: true });
       } else {
                navigate("/", { replace: true });
            }
        } else {
            setError(response.message);
        }
    };

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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-semibold mb-4">OTP Verification</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

                <InputOTP maxLength={6}  value={otp}
                   onChange={handleOtpChange} className="mb-4">
                <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTPGroup>
                </InputOTP>
               
                <Button onClick={handleVerifyOTP} className="w-full mt-2">Verify OTP</Button>
                <p className="mt-3 text-gray-500">Resend OTP in: {formatTime(timer)}</p>

            <Button
                onClick={handleResendOTP}
                disabled={isResendDisabled}
                className="mt-2"
            >
                {isResendDisabled ? "Resend OTP (Disabled)" : "Resend OTP"}
            </Button>
        </div>
    );
    
};

export default OTPVerification;
