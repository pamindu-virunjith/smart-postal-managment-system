import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const RealTimeDashboard = () => {
    const [parcels, setParcels] = useState([]);
    const [recentUpdates, setRecentUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState(null);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [trackingHistory, setTrackingHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Initialize Socket.io connection
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            timeout: 20000,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            // Join admin room for real-time updates
            newSocket.emit('joinAdminRoom');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        newSocket.on('connect_error', (error) => {
            console.log('Connection error:', error);
        });

        // Listen for parcel location updates
        newSocket.on('parcelLocationUpdated', (data) => {
            console.log('Real-time update received:', data);
            handleRealTimeUpdate(data);
            showNotification(`Parcel ${data.parcelID} location updated to ${data.newLocation}`, 'success');
        });

        // Fetch initial parcels data
        fetchParcels();

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    const fetchParcels = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/parcel', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setParcels(data);
            }
        } catch (error) {
            console.error('Error fetching parcels:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrackingHistory = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/tracking`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrackingHistory(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching tracking history:', error);
        }
    };

    const viewParcelDetails = (parcel) => {
        setSelectedParcel(parcel);
        fetchTrackingHistory(parcel.parcelID);
        setShowModal(true);
    };

    const handleRealTimeUpdate = (updateData) => {
        // Update parcels list
        setParcels(prevParcels => 
            prevParcels.map(parcel => 
                parcel.parcelID === updateData.parcelID 
                    ? { 
                        ...parcel, 
                        currentLocation: updateData.newLocation,
                        status: updateData.status,
                        updatedAt: updateData.timestamp
                      }
                    : parcel
            )
        );

        // Add to recent updates
        setRecentUpdates(prevUpdates => [
            {
                id: Date.now(),
                parcelID: updateData.parcelID,
                newLocation: updateData.newLocation,
                status: updateData.status,
                updatedBy: updateData.updatedBy,
                timestamp: updateData.timestamp
            },
            ...prevUpdates.slice(0, 9) // Keep only last 10 updates
        ]);
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800';
            case 'In Transit':
                return 'bg-yellow-100 text-yellow-800';
            case 'Pending':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                    <div className="flex items-center">
                        <div className="flex-1">
                            {notification.message}
                        </div>
                        <button 
                            onClick={() => setNotification(null)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Real-Time Parcel Dashboard</h1>
                    <p className="text-gray-600 mt-2">Monitor parcel updates and tracking in real-time</p>
                    <div className="flex items-center mt-4">
                        <div className={`w-3 h-3 rounded-full ${socket ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                        <span className="text-sm text-gray-600">
                            {socket ? 'Connected to real-time updates' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                {/* Recent Updates Panel */}
                {recentUpdates.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {recentUpdates.map((update) => (
                                    <div key={update.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Parcel {update.parcelID}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Location updated to: {update.newLocation}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                By {update.updatedBy} at {formatTimestamp(update.timestamp)}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(update.status)}`}>
                                            {update.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Parcels Grid - Enhanced View */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {parcels.map((parcel) => (
                        <div key={parcel.parcelID} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                            {/* Parcel Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{parcel.parcelID}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(parcel.status)}`}>
                                        {parcel.status}
                                    </span>
                                </div>
                                <p className="text-blue-100 text-sm">Details: {parcel.details}</p>
                            </div>

                            {/* Parcel Body */}
                            <div className="p-4">
                                {/* Customer Information */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Customer Details</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Name:</span> {parcel.name}</p>
                                        <p><span className="font-medium">Email:</span> {parcel.email}</p>
                                        <p><span className="font-medium">Parcel ID:</span> {parcel.parcelID}</p>
                                    </div>
                                </div>

                                {/* Current Location Section */}
                                <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Current Location
                                    </h4>
                                    <p className="text-blue-700 font-medium text-lg">{parcel.currentLocation || 'Processing Center'}</p>
                                    <p className="text-blue-600 text-sm">Last updated: {formatTimestamp(parcel.updatedAt || parcel.estimateDate)}</p>
                                </div>

                                {/* Delivery Information */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Delivery Details</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Address:</span> {parcel.address_line1}</p>
                                        <p><span className="font-medium">City:</span> {parcel.city}</p>
                                        <p><span className="font-medium">District:</span> {parcel.district}</p>
                                        <p><span className="font-medium">Estimate Date:</span> {
                                            parcel.estimateDate 
                                                ? new Date(parcel.estimateDate).toLocaleDateString()
                                                : 'TBD'
                                        }</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => viewParcelDetails(parcel)}
                                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        View Tracking
                                    </button>
                                    <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200">
                                        Contact Customer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for Parcel Details */}
                {showModal && selectedParcel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold">Parcel Details</h2>
                                        <p className="text-blue-100">Tracking: {selectedParcel.parcelID}</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="text-white hover:text-gray-200 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {/* Parcel Information */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Parcel Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Parcel ID:</span> {selectedParcel.parcelID}</p>
                                            <p><span className="font-medium">Details:</span> {selectedParcel.details}</p>
                                            <p><span className="font-medium">Status:</span> 
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedParcel.status)}`}>
                                                    {selectedParcel.status}
                                                </span>
                                            </p>
                                            <p><span className="font-medium">Current Location:</span> {selectedParcel.currentLocation || 'Processing Center'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {selectedParcel.name}</p>
                                            <p><span className="font-medium">Email:</span> {selectedParcel.email}</p>
                                            <p><span className="font-medium">Address:</span> {selectedParcel.address_line1}</p>
                                            <p><span className="font-medium">City:</span> {selectedParcel.city}</p>
                                            <p><span className="font-medium">District:</span> {selectedParcel.district}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking History */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Tracking History</h3>
                                    <div className="space-y-3">
                                        {trackingHistory.length > 0 ? trackingHistory.map((entry, index) => (
                                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-3 h-3 rounded-full mt-2 ${
                                                        index === 0 ? 'bg-blue-500' : 'bg-gray-400'
                                                    }`}></div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{entry.location}</p>
                                                            <p className="text-sm text-gray-600">{entry.notes || 'Location update'}</p>
                                                            <p className="text-xs text-gray-500">Updated by {entry.updatedBy}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                                                                {entry.status}
                                                            </span>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatTimestamp(entry.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-gray-500 text-center py-4">No tracking history available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {parcels.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No parcels found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealTimeDashboard;
