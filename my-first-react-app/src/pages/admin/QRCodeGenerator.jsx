import React, { useState } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = () => {
    const [orderId, setOrderId] = useState('');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const generateQRCode = async () => {
        if (!orderId.trim()) {
            setError('Please enter an Order ID');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Generate QR code using qrcode library
            const dataUrl = await QRCode.toDataURL(orderId.trim(), {
                width: 256,
                height: 256,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H'
            });

            setQrCodeDataUrl(dataUrl);
        } catch (err) {
            console.error('Error generating QR code:', err);
            setError('Failed to generate QR code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeDataUrl) return;

        const link = document.createElement('a');
        link.href = qrCodeDataUrl;
        link.download = `order-${orderId}-qr-code.png`;
        link.click();
    };

    const printQRCode = () => {
        if (!qrCodeDataUrl) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>QR Code - Order ${orderId}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            margin: 20px;
                        }
                        .qr-container {
                            display: inline-block;
                            padding: 20px;
                            border: 2px solid #000;
                            margin: 20px;
                        }
                        .order-id {
                            font-size: 18px;
                            font-weight: bold;
                            margin: 10px 0;
                        }
                        img {
                            display: block;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <div class="order-id">Order ID: ${orderId}</div>
                        <img src="${qrCodeDataUrl}" alt="QR Code for Order ${orderId}" />
                        <div style="margin-top: 10px; font-size: 12px; color: #666;">
                            Scan this QR code to track your order
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        QR Code Generator
                    </h1>
                    
                    {/* Order ID Input */}
                    <div className="mb-6">
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                            Order ID
                        </label>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                id="orderId"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g., ORD-001234)"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
                            />
                            <button
                                onClick={generateQRCode}
                                disabled={loading}
                                className={`${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-lg font-semibold transition duration-200`}
                            >
                                {loading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Loading Message */}
                    {loading && (
                        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                            Generating QR Code...
                        </div>
                    )}

                    {/* QR Code Display */}
                    {qrCodeDataUrl && (
                        <div className="text-center">
                            <div className="bg-white p-6 border-2 border-gray-300 rounded-lg inline-block mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Order ID: {orderId}
                                </h3>
                                <img 
                                    src={qrCodeDataUrl} 
                                    alt={`QR Code for Order ${orderId}`}
                                    className="mx-auto mb-4"
                                />
                                <p className="text-sm text-gray-600">
                                    Scan this QR code to track your order
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={downloadQRCode}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                                >
                                    Download PNG
                                </button>
                                <button
                                    onClick={printQRCode}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition duration-200"
                                >
                                    Print QR Code
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3">How to use:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                            <li>Enter the unique Order ID in the input field</li>
                            <li>Click "Generate" to create the QR code</li>
                            <li>Download or print the QR code</li>
                            <li>Attach the QR code to the parcel</li>
                            <li>Admins can scan this code to update the order location</li>
                        </ol>
                    </div>

                    {/* Quick Generate Options */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Quick Generate:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['ORD-001234', 'ORD-001235', 'ORD-001236', 'ORD-001237'].map((sampleId) => (
                                <button
                                    key={sampleId}
                                    onClick={() => {
                                        setOrderId(sampleId);
                                        setTimeout(generateQRCode, 100);
                                    }}
                                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
                                >
                                    {sampleId}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
