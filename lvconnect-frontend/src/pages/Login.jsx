import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
   
    const { login, oAuthLogin, setLoading, loading} = useAuthContext();
    const navigate = useNavigate();
    
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
        setLoading(true);
        setError(null);

        try {
            const response = await login(credentials); // Correctly awaiting the login function
    
            if (!response.success) {
                setError(response.message); // Show error message if login fails
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <button onClick={oAuthLogin}>Login with Google</button>
        </div>
    );
    
};

// }