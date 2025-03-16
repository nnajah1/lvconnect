import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import api from "../axios"; 
import { initializeDeviceId } from "../utils/device";

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser, refreshToken} = useAuthContext();
    const [rememberDevice, setRememberDevice] = useState(
        localStorage.getItem("remember_device") === "true"
    );


    useEffect(() => {
        const exchangeCodeForToken = async () => {
            const code = searchParams.get("code");

            if (!code) {
                navigate("/login"); // Redirect if no code
                return;
            }
            const rememberDevice = localStorage.getItem("remember_device") === "true";

            const deviceId = await initializeDeviceId();
            try {
                const response = await api.post("/auth/google/token", { code,
                remember_device: rememberDevice,
                device_id: deviceId
                 });

                // Check if password change is required BEFORE calling fetchUser()
            if (response.data.must_change_password) {
                console.log("Redirecting to change password...");
                navigate("/change-password", { state: { userId: response.data.user_id }, replace: true });
                return;
            }
            
             // Save rememberDevice in localStorage if checked
             if (rememberDevice) {
                localStorage.setItem("remember_device", "true");
            } else {
                localStorage.removeItem("remember_device");
            }

                    // Fetch user to confirm authentication
                    // if (response.status === 200) {
                        
                    await fetchUser(); 
                    await refreshToken();

                    
                    navigate("/dashboard"); // Redirect to dashboard
                // }
            } catch (error) {
                console.error("Google login failed:", error);
                navigate("/login?error=google_failed");
            }
        };

        exchangeCodeForToken();
    }, [searchParams, navigate, rememberDevice]);
        return <p>authenticating...</p>;
    };

export default OAuthCallback;
