import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext"; // Import auth context
import api from "../axios"; 
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
    const { checkAuth} = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                await checkAuth();
                navigate("/dashboard") // Redirect after login
            } catch (error) {
                console.error("OAuth Login Failed", error);
                navigate("/login"); // Redirect if failed
            }
        };

        verifyLogin();
    }, [navigate, checkAuth]);

    return <p>Logging in...</p>;
};

export default OAuthCallback;
