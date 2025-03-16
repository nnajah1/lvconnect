
import { useContext, useEffect, useState } from "react"
import { useAuthContext } from "../context/AuthContext";

export default function CreateUser() {
    const { createUser, user } = useAuthContext();

    // Check if the user is authorized (must be Admin or Super Admin)
    if (!user || !Array.isArray(user.roles) || 
    (!user.roles.some(role => role.name === "admin") && 
     !user.roles.some(role => role.name === "superadmin"))) {
    return <p>Not authorized to create users.</p>;
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: user.roles.some(role => role.name === "superadmin") ? "admin" : "student", // Default to student
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
       
        try {
            await createUser(formData);
            setSuccess("User created successfully!");
            setFormData({ name: "", email: "", role: user.roles.some(role => role.name === "superadmin") ? "admin" : "student" });
        } catch (err) {
            setError("Failed to create user.");
        }
            
       
    }

    return (
        <div>
            <h2>Create User</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="student">Student</option>
                        {user.roles.some(role => role.name === "superadmin") && (
                            <>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </>
                        )}
                    </select>
                </div>

                <button type="submit">Create User</button>
            </form>
        </div>
    )
}