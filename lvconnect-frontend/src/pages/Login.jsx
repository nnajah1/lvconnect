import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEnd } from "lucide-react"

export default function Login() {
   
    const { login, handleGoogleLogin, setLoading, loading} = useAuthContext();
    
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

    
        const response = await login(credentials); 
        if (!response.success) {
                setError(response.message); // Show error message if login fails
            }
       
        
    };



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
                loading={loading}
                handleGoogleLogin={handleGoogleLogin}
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