import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { initializeDeviceId } from "@/utils/device";
import api from "../../axios";

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser, refreshToken, setOtpRequired, setUserId } = useAuthContext();

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
                const response = await api.post("/auth/google/token", {
                    code,
                    remember_device: rememberDevice,
                    device_id: deviceId
                });

                const { otp_required, user_id, must_change_password } = response.data;

                // Check if password change is required BEFORE calling fetchUser()
                if (must_change_password) {
                    navigate("/change-password", { state: { userId: user_id }, replace: true });
                    return;
                }

                if (otp_required) {
                    // If OTP is required, store user_id and navigate to OTP page
                    setOtpRequired(true);
                    setUserId(user_id);
                    navigate("/verify-otp", { state: { userId: user_id } });
                    return;
                }

                // Save rememberDevice preference
                if (rememberDevice) {
                    localStorage.setItem("remember_device", "true");
                } else {
                    localStorage.removeItem("remember_device");
                }

                // Fetch authenticated user details
                await fetchUser();
                await refreshToken();

                navigate("/dashboard"); // Redirect to dashboard
            } catch (error) {
                console.error("Google login failed:", error);
                navigate("/login?error=google_failed");
            }
        };

        exchangeCodeForToken();
    }, [searchParams, navigate, fetchUser, refreshToken, setOtpRequired, setUserId]);

    return <p>Authenticating...</p>;
};

export default OAuthCallback;
