import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { getDeviceId } from "../utils/device";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
    const { verifyOTP } = useAuthContext();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [rememberDevice, setRememberDevice] = useState(false);

    // Retrieve userId, deviceId, and deviceName from the location state
    const { userId, deviceId, deviceName } = location.state || {};
    
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

    return (
        <div>
            <h2>OTP Verification</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleVerifyOTP}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                    />
                    Remember this device
                </label>
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
    
};

export default OTPVerification;
