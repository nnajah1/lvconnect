import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "../components/ui/input-otp";

const OTPVerification = () => {
    
    const location = useLocation();
    const navigate = useNavigate();
    const {sendOTP, verifyOTP} = useAuthContext();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [rememberDevice, setRememberDevice] = useState(false);
    const [timer, setTimer] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    // Retrieve userId, deviceId, and deviceName from the location state
    const { userId, deviceId, deviceName } = location.state || {};
    
    // Redirect to login if accessed directly
    if (!userId) {
        navigate("/login", { replace: true });
        return null;
    }

    useEffect(() => {
        const storedStartTime = localStorage.getItem("otpStartTime");

        if (storedStartTime) {
            const elapsedTime = Math.floor((Date.now() - storedStartTime) / 1000);
            const remainingTime = Math.max(120 - elapsedTime, 0);

            setTimer(remainingTime);
            setIsResendDisabled(remainingTime > 0);
        } else {
            // Start new timer if there's no previous session
            localStorage.setItem("otpStartTime", Date.now());
        }
    }, []);

   // Start countdown timer
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
    
        const response = await verifyOTP(userId, otp, deviceId, deviceName, rememberDevice);

        if (response.success) {
            navigate("/dashboard"); // Redirect after OTP success
        } else {
            setError(response.message);
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await sendOTP(userId, "unrecognized_device"); // Call API to resend OTP

            if (response.success) {
                alert("A new OTP has been sent to your email.");
                setTimer(120);
                setIsResendDisabled(true);
                localStorage.setItem("otpStartTime", Date.now()); // Save new start time
            } else {
                throw new Error(response.message || "Failed to resend OTP. Please try again.");
            }
        } catch (error) {
            console.error("Resend OTP failed:", error);
            alert(error.message);
        }
        // setIsResendDisabled(true); // Disable button again
        // setTimer(120); // Reset timer
        // localStorage.setItem("otp_expiration", Date.now() + 120000); // Store expiration timestamp


        // const response = await sendOTP(userId);

        // if (response.success) {
        //     alert("A new OTP has been sent to your email.");
        // } else {
        //     alert("Failed to resend OTP. Please try again.");
        // }
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

               {/* <input
                type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required>
                </input> */}

                <InputOTP maxLength={6}  value={otp}
                   onChange={handleOtpChange} className="mb-4">
                <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTPGroup>
                </InputOTP>
               
                <label>
                    <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                    />
                    Remember this device
                </label>
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
