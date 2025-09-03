import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketTest = () => {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            timeout: 20000,
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setConnected(true);
            setMessages(prev => [...prev, 'Connected to server']);
            newSocket.emit('joinAdminRoom');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnected(false);
            setMessages(prev => [...prev, 'Disconnected from server']);
        });

        newSocket.on('connect_error', (error) => {
            console.log('Connection error:', error);
            setMessages(prev => [...prev, `Connection error: ${error.message}`]);
        });

        newSocket.on('orderLocationUpdated', (data) => {
            console.log('Order update received:', data);
            setMessages(prev => [...prev, `Order ${data.orderId} updated to ${data.newLocation}`]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const testUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/orders/update-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: 'ORD-001234',
                    newLocation: 'Test Location - ' + new Date().toLocaleTimeString(),
                    notes: 'Test update from Socket test page'
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, 'Test update sent successfully']);
            } else {
                setMessages(prev => [...prev, `Error: ${data.message}`]);
            }
        } catch (error) {
            setMessages(prev => [...prev, `Network error: ${error.message}`]);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Socket.io Connection Test</h1>
            
            <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                    connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                        connected ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {connected ? 'Connected' : 'Disconnected'}
                </div>
            </div>

            <div className="mb-6">
                <button
                    onClick={testUpdate}
                    disabled={!connected}
                    className={`px-6 py-2 rounded-lg font-semibold ${
                        connected 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                >
                    Test Order Update
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Connection Log:</h2>
                <div className="max-h-64 overflow-y-auto space-y-1">
                    {messages.map((message, index) => (
                        <div key={index} className="text-sm text-gray-700">
                            [{new Date().toLocaleTimeString()}] {message}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                    <li>Check if the connection status shows "Connected"</li>
                    <li>Click "Test Order Update" to simulate a QR scan</li>
                    <li>Watch the connection log for real-time updates</li>
                    <li>Open the Admin Dashboard in another tab to see live updates</li>
                </ol>
            </div>
        </div>
    );
};

export default SocketTest;
