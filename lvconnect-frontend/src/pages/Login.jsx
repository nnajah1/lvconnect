import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { LoginForm } from "@/components/login-form"
import { initializeDeviceId } from "../utils/device";
import api from "../axios";

export default function Login() {
   
    const { login, handleGoogleLogin, setTimer} = useAuthContext();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [buttonLoading, setButtonLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [rememberDevice, setRememberDevice] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent submitting again if already in progress
        if (isSubmitting) return;
        setIsSubmitting(true); 
        setError(null);
        setButtonLoading(true);

      const deviceId = await initializeDeviceId();

        const response = await login(credentials, deviceId, rememberDevice );

        if (!response.success) {
          if (response.otpRequired) {
              setTimer(5); // Start the timer immediately
              localStorage.setItem("otpStartTime", Date.now()); // Save timer start time
        
              navigate("/otp" , {
    
                  state: {
                      userId: response.userId, // Send userId to OTP page
                      deviceId,
                      rememberDevice,
                  }
              });
              } else {
              setError(response.message || "Login failed.");
          }
      } else {
          navigate("/dashboard"); // Redirect to dashboard on successful login
      }
      setIsSubmitting(false);
      setButtonLoading(false);
    };

    //check if the current device is already trusted
    async function checkDevice(deviceName) {
      try {
        const response = await api.get('/trusted-device/check', { deviceName });

        return response.data; 
    } catch (error) {
        console.error('Error checking trusted device:', error);
        return { deviceId: null }; // Return null if the device is not trusted
    }
    }

    return (
      
        <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            
            </div>
            LVConnect
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm 
                credentials={credentials}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                buttonLoading={buttonLoading}
                handleGoogleLogin={handleGoogleLogin}
                error={error}
                rememberDevice ={rememberDevice}
                setRememberDevice = {setRememberDevice}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/assets/react.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
    );
    
};
