import { useState, useEffect } from "react";


const TrustedDevices = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetchTrustedDevices();
    }, []); 

    //fetch trusted devices from the API
    const fetchTrustedDevices = async () => {
        try {
            const response = await api.get("/trusted-devices");
            setDevices(response.data.devices);
        } catch(error) {
            return {message: "Error fetching devices"};
        }
    };

    const removeDevice = async(deviceId) => {
        try {
            await api.delete(`/trusted-devices/${deviceId}`);
            setDevices(devices.filter(device => device.device_id !== deviceId)); //update UI
        } catch (error) {
            return {mesage: "Error removing device"}
        }
    };

    return (
        <div>
            <h2> Trusted Devices</h2>
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