import {useRef, useState} from "react";
import { useAuthContext } from "../context/AuthContext";
// import OAuthLogin from "./GoogleAuth";

export default function Login() {
   
    const { login } = useAuthContext();
    // const navigate = useNavigate();

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

        try {
            await login(credentials);
        } catch (err) {
            setError("Invalid credentials.");
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

                <button type="submit">Login</button>
            </form>
        </div>
    );
    
};

// }