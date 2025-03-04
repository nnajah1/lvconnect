import api, {baseURL} from "../axios";
import { createContext, useState, useContext, useEffect } from "react";
const authContext = createContext( {
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
})

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("USER");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    
    const [loginUrl, setLoginUrl] = useState(null);


    // update token state and store in localStorage
    const setToken = (token) => {
        _setToken(token)
        if(token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        }
        else {
            localStorage.removeItem('ACCESS_TOKEN');
            // localStorage.removeItem("USER"); // Remove user data on logout
            // setUser(null);
        }
    }

    // Set User & Store in LocalStorage
    const setUserData = (userData) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem("USER", JSON.stringify(userData));
        } else {
            localStorage.removeItem("USER");
        }
    };
    
    // Handle Login
    const login = async (credentials) => {
        try {
            const response = await api.post("/login", credentials);
            const { user, token } = response.data;

            setUserData(user);
            setToken(token);

            return { success: true };
        } catch (error) {
            return { success: false, message: "Login Failed" };
        }
    };

    // Handle Logout
    const logout = async () => {
        try {
            await api.get("/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUserData(null);
            setToken(null);
        }
    };

    // Handle User Creation (Only Admin & Super Admin)
    const createUser = async (userData) => {
        try {
            const response = await api.get(
                "/createUser", userData
            );
            return response.data; // Return success message
        } catch (error) { 
            { error: "Failed to create user." };
        }
    };

    //handle Oauth - Google sign on
    const oAuthLogin = async () => {
        window.location.href = `${baseURL}/login/google`;
    };



    return (
            <authContext.Provider value={{
                token, 
                setToken, 
                user,
                // setUser: setUserData,
                login,
                logout,
                createUser,
                oAuthLogin
            
            }}>
                {children}
            </authContext.Provider>
        )
}

export const useAuthContext = () => useContext(authContext);

