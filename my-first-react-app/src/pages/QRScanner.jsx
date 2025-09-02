import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const QRScanner = () => {
    const [result, setResult] = useState('');
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user data from localStorage or context
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleScan = (result) => {
        if (result) {
            // Handle different result formats
            let scannedText = '';
            if (typeof result === 'string') {
                scannedText = result;
            } else if (Array.isArray(result) && result.length > 0) {
                scannedText = result[0].rawValue || result[0].text || result[0];
            } else if (result.text || result.rawValue) {
                scannedText = result.text || result.rawValue;
            }
            
            if (scannedText) {
                // extract parcel/order id from scanned text
                const parcelId = extractIdFromText(scannedText);
                console.log('[QRScanner] scannedText =', scannedText, 'parsed parcelId =', parcelId);
                setResult(parcelId || scannedText);
                setScanning(false);
                if (!parcelId) {
                    setError('Could not parse parcel ID from QR code');
                } else {
                    handleOrderUpdate(parcelId);
                }
            }
        }
    };

    const handleError = (err) => {
        console.error('QR Scanner Error:', err);
        setError('Failed to access camera. Please check permissions.');
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
            // call parcel update endpoint
            const response = await fetch(`http://localhost:3000/api/parcel/${orderId.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentLocation: user.postOfficeLocation || user.address,
                    status: 'In Transit',
                    notes: `Scanned by ${user.name} at ${new Date().toLocaleString()}`
                })
            });

            const data = await response.json();

            if (response.ok && (data.message?.toLowerCase().includes('updated successfully') || data.data)) {
                setSuccess(`Parcel ${orderId} location updated successfully!`);
                
                // Auto-clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                    setResult('');
                }, 3000);
            } else {
                setError(data.message || 'Failed to update parcel location');
            }
        } catch (err) {
            console.error('Error updating order:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // helper to extract id from scanned text
    function extractIdFromText(text) {
        if (!text) return null;
        const s = String(text).trim();
        // 1) Prefer query params when a URL
        try {
            const url = new URL(s);
            const keys = ['parcelID','parcelId','pid','id'];
            for (const k of keys) {
                const v = url.searchParams.get(k);
                if (v && /^P\d{1,8}$/i.test(v)) return v;
            }
            // 2) Prefer path segment strictly matching P<digits>
            const parts = url.pathname.split('/').filter(Boolean);
            const seg = parts.reverse().find(p => /^P\d{1,8}$/i.test(p));
            if (seg) return seg;
        } catch (e) {
            console.warn('Failed to parse URL in QRScanner.extractId:', e);
        }

        // 3) Fallback: search in plain text strictly for P<digits>
        const m = s.match(/(?:^|[^A-Z0-9])(P\d{1,8})(?=[^A-Z0-9]|$)/i);
        if (m) return m[1];
        return null;
    }

    const startScanning = () => {
        setScanning(true);
        setResult('');
        setError('');
        setSuccess('');
    };

    const stopScanning = () => {
        setScanning(false);
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
                        QR Code Scanner
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
                            Start QR Scanner
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

                {/* QR Scanner */}
                {scanning && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="relative">
                            <Scanner
                                onDecode={handleScan}
                                onError={handleError}
                                style={{ width: '100%' }}
                                constraints={{
                                    facingMode: 'environment'
                                }}
                            />
                            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Position the QR code within the frame
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
                    <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Parsed Parcel ID:</h3>
                        <p className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all">
                            {result}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Tap "Start QR Scanner" to activate your camera</li>
                        <li>Position the parcel's QR code within the scanning frame</li>
                        <li>Wait for the system to automatically detect and process the code</li>
                        <li>The order location will be updated to your current post office</li>
                        <li>A confirmation message will appear when successful</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;


