import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';

const AdminQRScanner = () => {
    const [result, setResult] = useState('');
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user data from localStorage first
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            console.log('User data from localStorage:', parsedUser);
            setUser(parsedUser);
            
            // If no role in localStorage, fetch from backend
            if (!parsedUser.role) {
                const token = localStorage.getItem('token');
                if (token) {
                    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        const fullUserData = {
                            ...parsedUser,
                            role: response.data.role
                        };
                        setUser(fullUserData);
                        // Update localStorage with role
                        localStorage.setItem('user', JSON.stringify(fullUserData));
                    })
                    .catch((err) => {
                        console.error('Failed to fetch user role:', err);
                    });
                }
            }
        }
    }, []);

    // helper: extract an id from scanned string (prefer strict P<digits>)
    function extractIdFromText(text) {
        if (!text) return null;
        const s = String(text).trim();
        try {
            const url = new URL(s);
            const keys = ['parcelID','parcelId','pid','id'];
            for (const k of keys) {
                const v = url.searchParams.get(k);
                if (v && /^P\d{1,8}$/i.test(v)) return v;
            }
            const parts = url.pathname.split('/').filter(Boolean);
            const seg = parts.reverse().find(p => /^P\d{1,8}$/i.test(p));
            if (seg) return seg;
        } catch (e) {
            console.warn('Failed to parse URL in extractIdFromText:', e);
        }
        const m = s.match(/(?:^|[^A-Z0-9])(P\d{1,8})(?=[^A-Z0-9]|$)/i);
        if (m) return m[1];
        return null;
    }

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
                // try to extract a parcel ID from the scanned text (robust for URLs, query params, plain ids)
                const parcelId = extractIdFromText(scannedText);
                console.log('Scanned text:', scannedText, ' -> parsed parcelId:', parcelId);
                setResult(parcelId || scannedText);
                setScanning(false);
                if (!parcelId) {
                    setError('Could not parse parcel ID from QR code');
                } else {
                    updateParcelLocation(parcelId);
                }
            }
        }
    };

    const handleError = (err) => {
        console.error('QR Scanner Error:', err);
        setError('Failed to access camera. Please check permissions and try again.');
    };

    const updateParcelLocation = async (parcelId) => {
        console.log('Current user:', user);
        console.log('User role:', user?.role);
        
        if (!user) {
            setError('Please login to scan parcels');
            return;
        }
        
        // Since this is AdminQRScanner, we're in the admin panel, so user should be admin
        // Let's also check if user doesn't have role but is in admin panel
        if (user.role && user.role !== 'admin' && user.role !== 'postman') {
            setError('Only admin or postman users can scan parcels');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const adminLocation = user.postOfficeLocation || user.address || 'Main Post Office';
            
            const response = await fetch(`http://localhost:3000/api/parcel/${parcelId.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'In Transit',
                    currentLocation: adminLocation
                })
            });

            const data = await response.json();

            if (data.message && data.message.includes('updated successfully')) {
                setSuccess(`✅ Parcel ${parcelId} location updated to: ${adminLocation}`);
                
                // Auto-clear messages after 4 seconds
                setTimeout(() => {
                    setSuccess('');
                    setResult('');
                }, 4000);
            } else {
                setError(data.message || 'Failed to update parcel location');
            }
        } catch (err) {
            console.error('Error updating parcel:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const startScanning = () => {
        setScanning(true);
        setResult('');
        setError('');
        setSuccess('');
    };

    const stopScanning = () => {
        setScanning(false);
    };

    // Test with manual input (for debugging)
    const handleManualTest = () => {
        // This will now automatically use 'P001' for the test update.
        updateParcelLocation('P001');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <p className="text-xl text-gray-600 mb-4">Please log in to access the parcel scanner</p>
                    <button 
                        onClick={() => window.location.href = '/'} 
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (user.role !== 'admin' && user.role !== 'postman') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <p className="text-xl text-red-600 mb-4">Access Denied</p>
                    <p className="text-gray-600">Only admin or postman users can scan parcels</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
                        📦 Parcel Scanner
                    </h1>
                    <p className="text-center text-gray-600 mb-4">
                        Scan parcel QR codes to update location
                    </p>
                    
                    {/* Admin Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">{user.name?.[0] || 'A'}</span>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-800">{user.name}</p>
                                <p className="text-xs text-blue-600 uppercase">{user.role}</p>
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded text-sm">
                            <span className="font-medium text-gray-700">📍 Location: </span>
                            <span className="text-gray-900">{user.postOfficeLocation || user.address || 'Main Post Office'}</span>
                        </div>
                    </div>
                </div>

                {/* Scanner Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    {!scanning && !loading && (
                        <button
                            onClick={startScanning}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition duration-200 shadow-lg"
                        >
                            📷 Start Scanning Parcels
                        </button>
                    )}

                    {scanning && !loading && (
                        <button
                            onClick={stopScanning}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition duration-200"
                        >
                            🛑 Stop Scanner
                        </button>
                    )}

                    {loading && (
                        <div className="text-center py-6">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                            <p className="text-gray-600 font-medium">Updating parcel location...</p>
                        </div>
                    )}
                </div>

                {/* QR Scanner Camera */}
                {scanning && (
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                        <div className="relative">
                            <Scanner
                                onDecode={handleScan}
                                onError={handleError}
                                constraints={{
                                    facingMode: 'environment'
                                }}
                                styles={{
                                    container: { width: '100%' }
                                }}
                            />
                            <div className="absolute inset-0 border-4 border-green-500 rounded-xl pointer-events-none">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-3 font-medium">
                            🎯 Point camera at parcel QR code
                        </p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-xl mb-6 shadow-md">
                        <div className="flex items-start">
                            <div className="text-2xl mr-3">✅</div>
                            <div>
                                <p className="font-bold">Success!</p>
                                <p>{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-red-100 to-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-md">
                        <div className="flex items-start">
                            <div className="text-2xl mr-3">❌</div>
                            <div>
                                <p className="font-bold">Error:</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Last Scanned Result */}
                {result && !loading && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="font-bold text-gray-800 mb-3 text-lg">📋 Last Scanned:</h3>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="font-mono text-lg font-bold text-center text-blue-600">
                                {result}
                            </p>
                        </div>
                    </div>
                )}

                {/* Test Button (for development) */}
                {import.meta.env.DEV && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-yellow-800 mb-2">Development Test:</p>
                        <button
                            onClick={handleManualTest}
                            disabled={loading}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 disabled:bg-yellow-300"
                        >
                            Test Update (P001)
                        </button>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">📖 How to Use:</h3>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li>Tap <span className="font-bold text-green-600">"Start Scanning Parcels"</span></li>
                        <li>Point your camera at the parcel's QR code</li>
                        <li>Wait for automatic detection</li>
                        <li>Parcel location updates to: <span className="font-bold text-blue-600">{user.postOfficeLocation || user.address || 'Main Post Office'}</span></li>
                        <li>Success message shows confirmation</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default AdminQRScanner;
