import { useLocation } from "react-router-dom";
import api from "../axios";
import { createContext, useState, useContext, useEffect } from "react";
import { initializeDeviceId } from "@/utils/device";

const AuthContext = createContext({
    user: null,
    setUser: () => { },
    login: () => { },
    logout: () => { },
    createUser: () => { },
    oAuthLogin: () => { },
});

let retryCount = 0; // Track retries

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        const loadDeviceId = async () => {
            const fingerprintId = await initializeDeviceId();
            setDeviceId(fingerprintId);
        };
        loadDeviceId();
    }, []);


    // function to fetch current user
    const fetchUser = async () => {
        setLoading(true);

        try {
            const response = await api.get("/me");
            retryCount = 0; // Reset retry count on success
            setUser(response.data.user);
        } catch (error) {
            if (error.response?.status === 401 && retryCount < 1) {
                retryCount++;
                const refreshed = await refreshToken();

                if (refreshed) {
                    return fetchUser(); // Retry fetching user after refresh
                }
            }
            setUser(null);
            setLoading(false);
        } finally {
            if (retryCount === 0) setLoading(false); // Prevent multiple loading states
        }
    };

    // Run fetchUser
    useEffect(() => {
        fetchUser();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await api.post("/refresh");

            if (response.status === 200) {
                return true; // Token refreshed
            }
        } catch (error) {
            // If the refresh token is expired, force logout
            if (error.response?.status === 401) {
                setUser(null); // Logout user
                setLoading(false);
            }

        }

        return false; // Failed to refresh
    };

    // Handle login
    const login = async (credentials, rememberDevice) => {

        try {

            const response = await api.post("/login", { ...credentials, device_id: deviceId, remember_device: rememberDevice });

            if (response.data.otp_required) {
                return {
                    success: false,
                    otpRequired: true,
                    userId: response.data.user_id,
                    message: "OTP required",
                };
            }

            if (response.data.must_change_password) {
                return {
                    mustChangePassword: true,
                    userId: response.data.user_id,
                    message: "Password change required",
                };
            }

            if (response.status === 200) {

                await refreshToken();
                await fetchUser(); // Fetch the user after login

                return { success: true };
            } else {
                return { success: false, message: "Login Failed" };
            }
        } catch (error) {
            return { success: false, message: "Invalid credentials" };
        }
    };

    //  // Send OTP to user
    const sendOTP = async (userId, purpose) => {
        try {
            const response = await api.post("/send-otp", { user_id: userId, purpose });

            if (response.status === 200) {
                return { success: true, message: "OTP sent successfully" };
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                return { success: false, message: "Please wait before requesting a new OTP" };
            }
            return { success: false, message: "Failed to send OTP" };
        }
    };

    // Verify OTP
    const verifyOTP = async (userId, otp, rememberDevice, isOAuth = false) => {

        try {
            const response = await api.post("/verify-otp", {
                user_id: userId,
                otp,
                device_id: deviceId,
                remember_device: rememberDevice,

            });

            if (response.data.must_change_password) {
                return { success: true, mustChangePassword: true, userId }; // Redirect to change password
            }

            await refreshToken();
            await fetchUser(); // Fetch user details after successful OTP verification


            return { success: true };

        } catch (error) {
            return { success: false, message: error.response?.data?.message || "OTP Verification Failed" };
        }
    };


    // Handle logout (Clears cookie)
    const logout = async () => {
        try {
            await api.get("/logout", {},);
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Create user (Admin/Super Admin only)
    const createUser = async (userData) => {
        try {
            const response = await api.post("/create-user", userData);
            return response.data;
        } catch (error) {
            return { error: "Failed to create user." };
        }
    };

    // Google OAuth login 
    const handleGoogleLogin = async () => {
        try {
            window.location.href = "http://localhost:8000/api/login/google/redirect";

        } catch (error) {
            return { message: "google login failed" }
        }
    };

    const exchangeGoogleToken = async (code, rememberDevice) => {
        try {
            const response = await api.post("/auth/google/token", {
                code,
                device_id: deviceId,
                remember_device: rememberDevice,
            });
    
            if (response.data.otp_required) {
                return {
                    success: false,
                    otpRequired: true,
                    userId: response.data.user_id,
                    message: "OTP required",
                };
            }
    
            if (response.data.must_change_password) {
                return {
                    mustChangePassword: true,
                    userId: response.data.user_id,
                    message: "Password change required",
                };
            }
    
            if (response.status === 200) {
                await refreshToken();
                await fetchUser(); // Fetch the user after login
                return { success: true, userId: response.data.user_id };
            }
    
            return { success: false, message: "Unexpected response from server" };
    
        } catch (error) {
            console.error("Google Auth Error:", error.response?.data || error);
            return {
                success: false,
                message: error.response?.data?.message || "Google authentication failed",
            };
        }
    };
    





    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            createUser,
            setLoading,
            loading,
            handleGoogleLogin,
            fetchUser,
            verifyOTP,
            sendOTP,
            setTimer,
            timer,
            refreshToken,
            isResendDisabled,
            setIsResendDisabled,
            deviceId,
            exchangeGoogleToken,

        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
