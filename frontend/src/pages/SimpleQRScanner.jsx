import React, { useState, useEffect } from 'react';

const SimpleQRScanner = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleManualInput = (orderId) => {
        if (orderId && orderId.trim()) {
            setResult(orderId.trim());
            handleOrderUpdate(orderId.trim());
        }
    };

    const handleOrderUpdate = async (orderId) => {
        if (!user || (user.role !== 'admin' && user.role !== 'postman')) {
            setError('Only admin users can update order locations');
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
                    notes: `Updated by ${user.name} at ${new Date().toLocaleString()}`
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
                    <p className="text-xl text-gray-600">Please log in to access the order updater</p>
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
                        Simple Order Updater
                    </h1>
                    <p className="text-center text-gray-600">
                        Manually enter order ID to update location
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Logged in as:</strong> {user.name}<br/>
                            <strong>Location:</strong> {user.postOfficeLocation || user.address}
                        </p>
                    </div>
                </div>

                {/* Manual Input Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const orderId = formData.get('orderId');
                        handleManualInput(orderId);
                    }}>
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                            Order ID
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="orderId"
                                id="orderId"
                                placeholder="Enter Order ID (e.g., ORD-001234)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                                    loading 
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Test Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Quick Test (Sample Orders):</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['ORD-001234', 'ORD-001235', 'ORD-001236', 'ORD-001237'].map((orderId) => (
                            <button
                                key={orderId}
                                onClick={() => handleManualInput(orderId)}
                                disabled={loading}
                                className={`px-3 py-2 text-sm rounded-lg font-medium transition duration-200 ${
                                    loading 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {orderId}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                            <p className="text-gray-600">Updating order location...</p>
                        </div>
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

                {/* Result */}
                {result && !loading && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Last Updated Order:</h3>
                        <p className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                            {result}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Enter an Order ID in the input field</li>
                        <li>Click "Update" to change the order location</li>
                        <li>Or use the quick test buttons for sample orders</li>
                        <li>Watch the dashboard update in real-time!</li>
                        <li>Use this as a fallback if QR scanning doesn't work</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default SimpleQRScanner;
