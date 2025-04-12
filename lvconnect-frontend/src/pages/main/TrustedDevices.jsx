import { useState, useEffect } from "react";
import api from "../../services/axios";


const TrustedDevices = () => {
    const [devices, setDevices] = useState([]);

  const [error, setError] = useState(null);
  
    // Fetch trusted devices from the API
    const fetchTrustedDevices = async () => {
        try {
          const response = await api.get("/trusted-devices");
          setDevices(response.data.devices);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch trusted devices");
        }
      };
    
    useEffect(() => {
        fetchTrustedDevices();
    }, []);


    // Remove a trusted device
    const removeDevice = async (deviceId) => {
        try {
          await api.delete(`/trusted-devices/${deviceId}`);
          setDevices((prevDevices) => prevDevices.filter(device => device.device_id !== deviceId));
        } catch (err) {
          setError(err.response?.data?.error || "Failed to remove device");
        }
    };

    return (
        <div>
            <h2>Trusted Devices</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {devices.length === 0 ? (
                <p>No trusted devices found.</p>
            ) : (
                <ul>
                    {devices.map(device => (
                        <li key={device.device_id}>
                        {device.device_name} - {new Date(device.last_used_at).toLocaleDateString()}
                        <button onClick={() => removeDevice(device.device_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TrustedDevices;