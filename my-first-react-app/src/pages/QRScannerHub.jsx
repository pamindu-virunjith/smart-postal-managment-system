import React from 'react';
import { Link } from 'react-router-dom';
import { FaQrcode, FaCamera, FaMobile, FaDesktop } from 'react-icons/fa';

const QRScannerHub = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        QR Scanner Hub
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Choose your preferred QR scanning method
                    </p>
                </div>

                {/* Scanner Options Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* Original QR Scanner */}
                    <Link to="/qr-scanner" className="group">
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <FaQrcode className="text-xl text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">QR Scanner</h2>
                            </div>
                            <p className="text-gray-600 mb-3 text-sm">
                                Standard QR code scanner with camera access.
                            </p>
                            <div className="flex items-center text-sm text-blue-600 font-medium">
                                <FaMobile className="mr-2" />
                                Mobile Compatible
                            </div>
                        </div>
                    </Link>

                    {/* Camera Scanner */}
                    <Link to="/camera-scanner" className="group">
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <FaCamera className="text-xl text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Camera Scanner</h2>
                            </div>
                            <p className="text-gray-600 mb-3 text-sm">
                                Advanced camera-based scanner using ZXing library.
                            </p>
                            <div className="flex items-center text-sm text-green-600 font-medium">
                                <FaCamera className="mr-2" />
                                Enhanced Features
                            </div>
                        </div>
                    </Link>

                    {/* Simple Scanner */}
                    <Link to="/simple-scanner" className="group">
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <FaMobile className="text-xl text-purple-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Simple Input</h2>
                            </div>
                            <p className="text-gray-600 mb-3 text-sm">
                                Manual order ID input - no camera required.
                            </p>
                            <div className="flex items-center text-sm text-purple-600 font-medium">
                                <FaMobile className="mr-2" />
                                Fallback Option
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Admin Tools */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Tools</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link to="/admin/qr-generator" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <FaQrcode className="text-xl text-purple-600 mr-3" />
                            <span className="font-medium text-gray-900">QR Generator</span>
                        </Link>
                        <Link to="/admin/dashboard" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <FaDesktop className="text-xl text-blue-600 mr-3" />
                            <span className="font-medium text-gray-900">Live Dashboard</span>
                        </Link>
                        <Link to="/socket-test" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                            <span className="font-medium text-gray-900">Socket Test</span>
                        </Link>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">For Mobile Users:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                <li>Login to your admin account</li>
                                <li>Choose either QR Scanner or Camera Scanner</li>
                                <li>Grant camera permissions when prompted</li>
                                <li>Point camera at the QR code</li>
                                <li>Wait for automatic detection</li>
                                <li>Confirm location update</li>
                            </ol>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">For Desktop Users:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                <li>Open the Live Dashboard in your browser</li>
                                <li>Keep it open to monitor real-time updates</li>
                                <li>Use the QR Generator to create order QR codes</li>
                                <li>Print and attach QR codes to parcels</li>
                                <li>Watch dashboard update when mobile users scan</li>
                                <li>View detailed tracking history</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Sample Data Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">Sample Data Available:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
                        <div>
                            <p><strong>ORD-001234</strong> - John Doe (Processing Center)</p>
                            <p><strong>ORD-001235</strong> - Jane Smith (Kandy Distribution)</p>
                        </div>
                        <div>
                            <p><strong>ORD-001236</strong> - Bob Johnson (Out for Delivery)</p>
                            <p><strong>ORD-001237</strong> - Alice Wilson (Delivered)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScannerHub;
