import { useState } from "react";
import api from "@/services/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import preventBackNavigation from "@/utils/preventBackNavigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/illustration.jpg";

import LVConnect from "@/components/ui/lv-connect";
import { set } from "date-fns";

const ResetPassword = () => {

  preventBackNavigation(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");


  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)


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
      toast.error("Passwords do not match.");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true)
    try {
      const response = await api.post("/reset-password", {
        email,
        token,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success(response.data.message || "Password changed successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email || !token) {
      toast.error("Invalid or expired link");
      navigate("/login");
    }
  }, [email, token]);
  console.log(token)

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <img
        src={illustration || "/placeholder.svg"}
        alt="Background"
        className="absolute w-full h-full blur-[2px] object-cover"
      />

      <div className="relative bg-white/70 backdrop-blur-sm rounded-lg shadow-lg w-[580px] h-[450px] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center items-center mb-2">
            <LVConnect />
          </div>
          <div className="w-full px-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-800 text-center mb-4 tracking-tight">Change Password</h2>

            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 w-64 text-base font-medium border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 placeholder:text-gray-400 bg-white/90 backdrop-blur-sm"
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 text-base font-medium border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 placeholder:text-gray-400 bg-white/90 backdrop-blur-sm"
            />

            <Button
              onClick={handleChangePassword}
              className="w-full h-10  text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "saving..." : "Update Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};
export default ResetPassword;