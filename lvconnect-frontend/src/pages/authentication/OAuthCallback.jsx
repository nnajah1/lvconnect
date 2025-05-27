import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { Authenticate } from "@/components/dynamic/loader";

const OAuthCallback = () => {
    const { exchangeGoogleToken, deviceId } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [rememberDevice, setRememberDevice] = useState(
        localStorage.getItem("remember_device") === "true"
    );

    useEffect(() => {
        const handleOAuthLogin = async () => {
            if (loading) return; // Prevent multiple executions
            setLoading(true);

            const queryParams = new URLSearchParams(location.search);
            const code = queryParams.get("code");

            if (!code) {
                navigate("/login?error=missing_oauth_code");
                return;
            }

            try {
                const response = await exchangeGoogleToken(code);
                console.log("Google Login Response:", response);

                if (!response.success) {
                    
                    if (response.otpRequired) {
                        console.log("Redirecting to OTP page...");

                        // Store remember device preference
                        if (response.rememberDevice) {
                            localStorage.setItem("remember_device", "true");
                        } else {
                            localStorage.removeItem("remember_device");
                        }

                        navigate("/otp", { 
                            state: { 
                                userId: response.userId, 
                                rememberDevice: rememberDevice, 
                                isOAuth: true 
                            } 
                        });
                    } else if (response.mustChangePassword) {
                        console.log("Redirecting to password reset...");
                        navigate("/change-password", { 
                            state: { userId: response.userId } 
                        });
                    } else {
                        console.error("OAuth Token Exchange Failed:", response.message);
                        navigate(`/login?error=${response.message}`);
                    }
                } else {
                    console.log("Successful Login - Redirecting to Dashboard...");
                    navigate("/");
                }
            } catch (error) {
                console.error("OAuth Callback Error:", error);
                navigate("/login?error=oauth_exception");
            }
        };
        setLoading(false);
        handleOAuthLogin();
    }, [location.search, navigate, exchangeGoogleToken,]);

    return <Authenticate />;
};

export default OAuthCallback;