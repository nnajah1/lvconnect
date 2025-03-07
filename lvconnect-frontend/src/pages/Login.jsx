import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { LoginForm } from "@/components/login-form"
import { getDeviceId } from "../utils/device";
import api from "../axios";

export default function Login() {
   
    const { login, handleGoogleLogin} = useAuthContext();
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prevent submitting again if already in progress
        if (isSubmitting) return;
        setIsSubmitting(true); 
        setError(null);
        setButtonLoading(true);

        //  // unique key combining the user id and device id
        // const userId = credentials.email;  
        // const deviceKey = `deviceId-${userId}`;  

        // // Check if a device ID already exists 
        // let deviceId = localStorage.getItem(deviceKey);

        // // If no device ID exists, generate a new one 
        // if (!deviceId) {
        //     deviceId = await getDeviceId();
        //     localStorage.setItem(deviceKey, deviceId); // Store deviceId in localStorage with user-specific key
        // }
        
        
        // Check if a device ID already exists
        let deviceId = localStorage.getItem('deviceId');
        const deviceName = navigator.userAgent;
        if (!deviceId) {
          // If no deviceId exists locally, check with the backend
          const response = await checkDevice(deviceName);
  
          if (response.deviceId) {
              // Use the existing deviceId if found
              deviceId = response.deviceId;
              localStorage.setItem('deviceId', deviceId); // Store it locally for future use
          } else {
              // Otherwise, generate a new device ID
              deviceId = await getDeviceId();
              localStorage.setItem('deviceId', deviceId); // Store the new deviceId
          }
      }

        const response = await login(credentials, deviceId, deviceName);

        if (!response.success) {
          if (response.otpRequired) {
              navigate("/otp", {
                  state: {
                      userId: response.userId, // Send userId to OTP page
                      deviceId,
                      deviceName
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
        // <div>
        //     <h2>Login</h2>
        //     {error && <p style={{ color: "red" }}>{error}</p>}

        //     <form onSubmit={handleSubmit}>
        //         <div>
        //             <label>Email:</label>
        //             <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
        //         </div>
        //         <div>
        //             <label>Password:</label>
        //             <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
        //         </div>

        //         <button type="submit" disabled={loading}>
        //             {loading ? "Logging in..." : "Login"}
        //         </button>
        //     </form>
        //     <button onClick={handleGoogleLogin}>Login with Google</button>
        // </div>
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

// }