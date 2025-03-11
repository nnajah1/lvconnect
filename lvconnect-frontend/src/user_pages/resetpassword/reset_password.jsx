import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LVConnect from "../../components/lv-connect";
import Button from "../../components/button";
import "../../user_pages//reset_password/reset_pasword.css"; // Import the CSS file
// import "./reset_pasword.css"

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => ({
    length: password.length >= 8 && password.length <= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@#$!%^&]/.test(password),
  });

  const validation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const getValidationColor = (condition) => {
    if (newPassword === "") return "text-black";
    return condition ? "validation-success" : "validation-error";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (passwordsMatch && Object.values(validation).every(Boolean)) {
      console.log("Password successfully changed!");
    }
  };

  return (
    <div className="reset-password-container">
      <LVConnect />
      <div className="reset-password-box">
        <h2 className="reset-password-title">Reset Password</h2>
        <p className="reset-password-description">
          Create a strong new password to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <label className="input-label">New password</label>
          <div className="input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
              className="input-field"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility("new")}>
              {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <label className="input-label">Confirm password</label>
          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              className="input-field"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility("confirm")}>
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {formSubmitted && !passwordsMatch && (
            <p className="error-message">Passwords do not match</p>
          )}

          <p className="validation-text">
            <strong className={getValidationColor(validation.length)}>At least 8-12 characters long</strong>
            <br />
            <span className={getValidationColor(validation.uppercase)}>One uppercase letter (A-Z)</span>
            <br />
            <span className={getValidationColor(validation.lowercase)}>One lowercase letter (a-z)</span>
            <br />
            <span className={getValidationColor(validation.number)}>One number (0-9)</span>
            <br />
            <span className={getValidationColor(validation.specialChar)}>One special character (@, #, $, !, %, ^, &)</span>
          </p>

          <Button type="submit" fullWidth className="mt-7">
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
