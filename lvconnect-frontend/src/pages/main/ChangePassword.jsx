import  { useLocation, useNavigate }  from  "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../axios"; 
import { useAuthContext } from "@/context/AuthContext";

const ChangePassword = () => {

        // Add this to button before here
        // setTimer(5); // Start the timer immediately
        // localStorage.setItem("otpStartTime", Date.now()); // Save timer start time
        
    const {sendOTP, setTimer, timer, user } = useAuthContext();
    const navigate = useNavigate();

    // Redirect to login if accessed directly
    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]); 


    const [step, setStep] = useState("otp");
    const [otp, setOtp] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

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
     
    // Handle OTP submission
    const handleVerifyOtp = async (e) => {

        setError(null);
        setSuccess(null);
        setIsSubmitting(true);
        e.preventDefault();

        

        try {
            const response = await api.post("/verify-password-otp", {
                otp,
            });
            setSuccess(response.data.message);
            setStep("password"); // Move to password change step
        } catch (error) {
            setError(error.response?.data?.error || "Invalid OTP");
        }
        setIsSubmitting(false);
    };

    const handleResendOTP = async () => {
        try {
            const response = await sendOTP(user, "new_password"); // Call API to resend OTP

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

    const validatePassword = (password) => {
        const minLength = /.{8,}/;  
        const hasLowercase = /[a-z]/;
        const hasUppercase = /[A-Z]/;
        const hasNumber = /[0-9]/;
        const hasSpecialChar = /[\W]/; // Special characters
    
        if (!minLength.test(password)) return "Password must be at least 8 characters.";
        if (!hasLowercase.test(password)) return "Password must include a lowercase letter.";
        if (!hasUppercase.test(password)) return "Password must include an uppercase letter.";
        if (!hasNumber.test(password)) return "Password must include a number.";
        if (!hasSpecialChar.test(password)) return "Password must include a special character.";
    
        return null; // No error
    };

    // Handle password change 
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        if (!user) {
            setError("Invalid request.");
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setIsSubmitting(false);
            return;
        }

        const validationError = validatePassword(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }   

        try {
            const response = await api.post("/change-password", {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            if (response.status === 200) {
                setSuccess("Password changed successfully.");
                navigate("/dashboard"); // Redirect after changing password
            } else {
                setError("Failed to change password.");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Error changing password. Please try again.");
        }

        setIsSubmitting(false);
    };
    return (
        <div>
            <h2>Change Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            {step === "otp" ? (
                <form onSubmit={handleVerifyOtp}>
                    <label>Enter OTP</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                     <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>

                <p className="mt-3 text-gray-500">Resend OTP in: {formatTime(timer)}</p>

                <button
                    onClick={handleResendOTP}
                    disabled={isResendDisabled}
                    className="mt-2"
                >
                    {isResendDisabled ? "Resend OTP (Disabled)" : "Resend OTP"}
                </button>
                </form>
            ) : (
                <form onSubmit={handleChangePassword}>
                   
                    <div>
                        <label>Current Password</label>
                        <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                        />
                    </div>
                

                    <div>
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Change Password"}
                    </button>
                </form>

            )}
        </div>
    );
};

export default ChangePassword;