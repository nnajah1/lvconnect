import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import api from "../axios"; 

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser} = useAuthContext();
        

    useEffect(() => {
        const exchangeCodeForToken = async () => {
            const code = searchParams.get("code");

            if (!code) {
                navigate("/login"); // Redirect if no code
                return;
            }

            try {
                const response = await api.post("/auth/google/token", { code });
                
                    // Fetch user to confirm authentication
                    if (response.status === 200) {
                    await fetchUser(); 
                    navigate("/dashboard"); // Redirect to dashboard
                }
            } catch (error) {
                console.error("Google login failed:", error);
                navigate("/login?error=google_failed");
            }
        };

        exchangeCodeForToken();
    }, [searchParams, navigate]);
        return <p>authenticating...</p>;
    };

export default OAuthCallback;
