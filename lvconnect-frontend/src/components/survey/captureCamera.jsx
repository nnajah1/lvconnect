import { useAuthContext } from '@/context/AuthContext';
import React, { useEffect, useRef, useState } from 'react';
import { CameraOff } from "lucide-react";
import { useUserRole } from '@/utils/userRole';

const WebcamCapture = ({ onCapture, photo }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState(photo || null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [hasCaptured, setHasCaptured] = useState(!!photo);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const userRole = useUserRole();
    
    // Effect to handle initial photo state
    useEffect(() => {
        if (photo) {
            setCapturedPhoto(photo);
            setHasCaptured(true);
        }
    }, [photo]);
      
      // Also cleanup on unmount just in case
      useEffect(() => {
        return () => {
          if (isCameraActive) {
            stopCamera();
          }
        };
      }, [isCameraActive]);

    const startCamera = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setIsCameraActive(true);
                setHasCaptured(false);
                setCapturedPhoto(null);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError(`Camera access error: ${err.message || 'Unknown error'}`);
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        const video = videoRef.current;
      
        if (!video || !video.srcObject) return;
      
        const stream = video.srcObject;
        const tracks = stream.getTracks();
      
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        setIsCameraActive(false);
      };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(imageData);
        setHasCaptured(true);
        stopCamera();

        // Notify parent component
        onCapture({
            base64: imageData,
            taken_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        });
    };

    const retakePhoto = async () => {
        setIsLoading(true);
        try {
            setCapturedPhoto(null);
            setHasCaptured(false);
            await startCamera(); // wait for camera to initialize
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto rounded-lg shadow-sm overflow-hidden bg-gray-100">
            {!isCameraActive && !capturedPhoto && !cameraError && (
                <div className="flex justify-center items-center p-8 w-full">
                    <CameraOff className="h-12 w-12 text-gray-400 transition-all duration-300" />
                </div>
            )}

            {cameraError && (
                <div className="text-red-600 p-3 mb-4 border border-red-200 bg-red-50 rounded-md w-full text-sm">
                    {cameraError}
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`my-4 w-full max-w-md rounded-md ${isCameraActive ? 'block' : 'hidden'}`}
                style={{ width: '100%', maxWidth: '400px' }}
            />

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {capturedPhoto && (
                <div className="mt-4 w-full px-4 pb-4 flex flex-col items-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">Captured Image</p>
                    <img
                        src={capturedPhoto || "/placeholder.svg"}
                        alt="Captured"
                        className="border border-gray-200 rounded-md max-w-xs w-full shadow-sm"
                    />
                </div>
            )}

            {userRole === "student" && (
                <div className="camera-controls mt-4 flex justify-center space-x-3 w-full px-4 pb-4">

                    {!isCameraActive && !capturedPhoto && (
                        <div>
                            {isLoading ? (
                                <div className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm">Opening Camera...</div>
                            ) : (
                                <button
                                type="button"
                                onClick={startCamera}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm"
                                >
                                    Start Camera
                                </button>)
                            }

                        </div>
                    )}

                    {isCameraActive && (
                        <div className='flex gap-4'>

                            <button
                                type="button"
                                onClick={stopCamera}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm"
                            >
                                Close Camera
                            </button>

                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm"
                            >
                                Capture
                            </button>
                        </div>

                    )}

                    {capturedPhoto && (
                        <button
                            type="button"
                            onClick={retakePhoto}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm"
                        >
                            Retake
                        </button>
                    )}
                </div>
            )}


        </div>
    );
};

export default WebcamCapture;
