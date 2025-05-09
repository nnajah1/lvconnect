import { useAuthContext } from '@/context/AuthContext';
import React, { useRef, useState } from 'react';
import { CameraOff } from "lucide-react";

const WebcamCapture = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const { user } = useAuthContext();
    const userRole = user?.roles?.[0]?.name;

    // Function to start the camera
    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);  // Camera is active
    };

    // Function to stop the camera
    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
        setIsCameraActive(false);  // Camera is stopped
    };

    // Function to capture the photo
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setPhoto(imageData); // Store the captured image data
    };

    return (
        <div className="camera-container">
            {/* Camera Placeholder */}
            {!isCameraActive && (
                <div className="flex justify-center">
                    <CameraOff className="h-12 w-12 text-slate-500 dark:text-slate-400 transition-all duration-300 text-center" />
                </div>
            )}

            {/* Camera Preview (shown when active) */}
            {isCameraActive && (
                <video ref={videoRef} className="mb-4" style={{ width: '100%', maxWidth: '400px' }} />
            )}
            {userRole === "student" && (
                <div className="camera-controls mt-4">

                    {!isCameraActive ? (
                        <button
                            onClick={startCamera}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Start Camera
                        </button>
                    ) : (
                        <button
                            onClick={stopCamera}
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Close Camera
                        </button>
                    )}

                    <button
                        onClick={capturePhoto}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={!isCameraActive}
                    >
                        Capture
                    </button>


                </div>
            )}
            {/* Display captured image */}
            {photo && (
                <div className="mt-4">
                    <p>Captured Image:</p>
                    <img src={photo} alt="Captured" className="border" />
                </div>
            )}
        </div>

    );
};

export default WebcamCapture;
