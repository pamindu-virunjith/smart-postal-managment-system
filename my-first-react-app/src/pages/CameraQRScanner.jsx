import React, { useState, useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

const CameraQRScanner = () => {
    const [result, setResult] = useState('');
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);
    const videoRef = useRef(null);
    const codeReader = useRef(null);

    useEffect(() => {
        // Get user data from localStorage or context
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Initialize QR code reader
        codeReader.current = new BrowserQRCodeReader();

        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        try {
            setScanning(true);
            setError('');
            setResult('');
            setSuccess('');

            const constraints = {
                video: {
                    facingMode: 'environment' // Use back camera
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();

                // Start decoding
                codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
                    if (result) {
                        console.log('QR Code detected:', result.getText());
                        setResult(result.getText());
                        handleOrderUpdate(result.getText());
                        stopScanning();
                    }
                    if (error && error.name !== 'NotFoundException') {
                        console.error('QR Scanner Error:', error);
                    }
                });
            }
        } catch (err) {
            console.error('Error starting scanner:', err);
            setError('Failed to access camera. Please check permissions and try again.');
            setScanning(false);
        }
    };

    const stopScanning = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        
        if (codeReader.current) {
            codeReader.current.reset();
        }
        
        setScanning(false);
    };

    const handleOrderUpdate = async (orderId) => {
        if (!user || (user.role !== 'admin' && user.role !== 'postman')) {
            setError('Only admin users can scan QR codes');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/orders/update-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: orderId.trim(),
                    newLocation: user.postOfficeLocation || user.address,
                    notes: `Scanned by ${user.name} at ${new Date().toLocaleString()}`
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Order ${orderId} location updated successfully!`);
                
                // Auto-clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                    setResult('');
                }, 3000);
            } else {
                setError(data.message || 'Failed to update order location');
            }
        } catch (err) {
            console.error('Error updating order:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Please log in to access QR scanner</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Camera QR Scanner
                    </h1>
                    <p className="text-center text-gray-600">
                        Scan parcel QR codes to update location
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Logged in as:</strong> {user.name}<br/>
                            <strong>Location:</strong> {user.postOfficeLocation || user.address}
                        </p>
                    </div>
                </div>

                {/* Scanner Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    {!scanning && !loading && (
                        <button
                            onClick={startScanning}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Start Camera Scanner
                        </button>
                    )}

                    {scanning && !loading && (
                        <div className="space-y-4">
                            <button
                                onClick={stopScanning}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
                            >
                                Stop Scanning
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Updating order location...</p>
                        </div>
                    )}
                </div>

                {/* Camera View */}
                {scanning && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                className="w-full h-64 object-cover rounded-lg bg-black"
                                playsInline
                                muted
                            />
                            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Point camera at QR code to scan
                        </p>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                        <p className="font-semibold">Success!</p>
                        <p>{success}</p>
                    </div>
                )}

                {/* Scanned Result */}
                {result && !loading && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Scanned Order ID:</h3>
                        <p className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all">
                            {result}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Tap "Start Camera Scanner" to activate your camera</li>
                        <li>Point your camera at the parcel's QR code</li>
                        <li>Hold steady until the code is detected automatically</li>
                        <li>The order location will be updated to your current post office</li>
                        <li>A confirmation message will appear when successful</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default CameraQRScanner;
