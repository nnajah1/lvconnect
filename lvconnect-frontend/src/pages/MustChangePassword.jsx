import { useState } from "react";
import api from "../axios"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import preventBackNavigation from "../utils/preventBackNavigation";
import { useEffect } from "react";

const MustChangePassword = () => {
    
    preventBackNavigation(true);
    const { user, fetchUser, refreshToken } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;

    // Redirect to login if accessed directly
    useEffect(() => {
        if ( !user && !userId) {
            navigate("/login", { replace: true });
        } else if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [userId, user, navigate]); 
        
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newPassword, setNewPassword] = useState ("");
    const [confirmPassword, setConfirmPassword] = useState("");


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

    const handleChangePassword = async (e) => {
        e.preventDefault();


        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const validationError = validatePassword(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }   

        try {
            const response = await api.post("/must-change-password", {
                user_id: location.state.userId,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            if (response.data.message === "Password changed successfully") {   
               
                await refreshToken();
                await fetchUser();
                navigate("/dashboard", { replace: true }); 
                setSuccess("Password changed successfully");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Password change failed");
        }
    };

    return (
        <div>
        
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <h2>Change Password</h2>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button onClick={handleChangePassword}>Update Password</button>
        </div>
    );
};
export default MustChangePassword;