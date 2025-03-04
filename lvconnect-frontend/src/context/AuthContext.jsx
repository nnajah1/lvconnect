import api from "../axios";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({
    user: null,
    setUser: () => {},
    login: () => {},
    logout: () => {},
    createUser: () => {},
    oAuthLogin: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await api.get("/me",{withCredentials: true});
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
            if (error.response?.status === 401) {
                console.log("Unauthorized: Redirecting to login...");
            } else {
                console.error("Error fetching user:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    // Run fetchUser only once when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    // Handle login
    const login = async (credentials) => {
        try {
            const response = await api.post("/login", credentials);
            await fetchUser(); 
            return { success: true };
        } catch (error) {
            return { success: false, message: "Login Failed" };
        }
    };

    // Handle logout (Clears cookie)
    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    };

    // Create user (Admin/Super Admin only)
    const createUser = async (userData) => {
        try {
            const response = await api.post("/createUser", userData);
            return response.data;
        } catch (error) {
            return { error: "Failed to create user." };
        }
    };

    // Google OAuth login (redirects to backend)
    // const oAuthLogin = async () => {
    //     window.location.href = `${baseURL}/login/google`;
    // };

    
    return (
        <AuthContext.Provider value={{ user, login, logout, createUser, setLoading, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
