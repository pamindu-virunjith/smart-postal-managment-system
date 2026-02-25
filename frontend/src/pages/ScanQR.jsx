import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { FiPackage, FiUser, FiMail, FiMapPin, FiFileText, FiCalendar, FiCheckCircle, FiClock, FiTruck, FiRefreshCw, FiCamera, FiStar, FiShield, FiAward } from "react-icons/fi";

export default function ScanQR() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (result) => {
    if (result && result.length > 0) {
      try {
        // Parse the QR JSON data
        const parsedData = JSON.parse(result[0].rawValue);
        setScanResult(parsedData);
        setIsScanning(false);
      } catch {
        setScanResult({ error: "Invalid QR code format" });
        setIsScanning(false);
      }
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:", error);
    setScanResult({ error: "Camera access denied or scanner error" });
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "In Transit":
        return <FiTruck className="text-blue-500" />;
      case "Pending":
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-3">
              <FiCamera className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">QR Scanner</h1>
          </div>
          <p className="text-gray-600">Scan a parcel QR code to view details</p>
        </div>

        {/* QR Scanner */}
        {isScanning && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Camera Scanner</h2>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </div>
            </div>
            <div className="relative">
              <div className="w-full max-w-md mx-auto aspect-square bg-black rounded-xl overflow-hidden">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Scanner overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-blue-500 border-dashed rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4">
              Position the QR code within the frame
            </p>
          </div>
        )}

        {/* Scan Results */}
        {scanResult && !scanResult.error && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 border border-gray-100">
            {/* Premium Header with Gradient and Animation */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4 shadow-lg">
                      <FiPackage className="text-3xl" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-1 text-shadow">Order Details</h1>
                      <p className="text-white/90 font-medium">Successfully Scanned & Verified</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/15 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                    <FiShield className="text-2xl mr-2" />
                    <span className="font-bold text-lg">Authentic</span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center px-6 py-3 rounded-2xl text-lg font-bold shadow-xl backdrop-blur-sm border-2 ${getStatusColor(scanResult.status)} bg-white/20`}>
                    {getStatusIcon(scanResult.status)}
                    <span className="ml-3">{scanResult.status}</span>
                    <FiAward className="ml-3 text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Table Content */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
              {/* Parcel ID Highlight */}
              <div className="mb-8 text-center">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-white/80 text-sm font-semibold mb-1 uppercase tracking-wide">Tracking ID</p>
                  <p className="text-white text-3xl font-bold tracking-wider">{scanResult.parcelID}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
                  <tbody>
                    <tr className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="py-6 px-6 bg-gradient-to-r from-blue-50 to-blue-100 font-bold text-gray-800 w-1/3 border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="p-3 bg-blue-500 rounded-xl mr-4 shadow-lg">
                            <FiUser className="text-white text-lg" />
                          </div>
                          <span className="text-lg">Recipient</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-gray-800 text-xl font-semibold">
                        {scanResult.name}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-green-50 transition-colors duration-200">
                      <td className="py-6 px-6 bg-gradient-to-r from-green-50 to-green-100 font-bold text-gray-800 border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="p-3 bg-green-500 rounded-xl mr-4 shadow-lg">
                            <FiMail className="text-white text-lg" />
                          </div>
                          <span className="text-lg">Email Address</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-gray-800 text-lg font-medium break-all">
                        {scanResult.email}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-orange-50 transition-colors duration-200">
                      <td className="py-6 px-6 bg-gradient-to-r from-orange-50 to-orange-100 font-bold text-gray-800 border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="p-3 bg-orange-500 rounded-xl mr-4 shadow-lg">
                            <FiMapPin className="text-white text-lg" />
                          </div>
                          <span className="text-lg">Delivery Address</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-gray-800 text-lg font-medium leading-relaxed">
                        {scanResult.address || `${scanResult.address_line1}, ${scanResult.city}, ${scanResult.district}`}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-indigo-50 transition-colors duration-200">
                      <td className="py-6 px-6 bg-gradient-to-r from-indigo-50 to-indigo-100 font-bold text-gray-800 border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="p-3 bg-indigo-500 rounded-xl mr-4 shadow-lg">
                            <FiFileText className="text-white text-lg" />
                          </div>
                          <span className="text-lg">Package Details</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-gray-800 text-lg font-medium leading-relaxed">
                        {scanResult.details}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-pink-50 transition-colors duration-200">
                      <td className="py-6 px-6 bg-gradient-to-r from-pink-50 to-pink-100 font-bold text-gray-800 border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="p-3 bg-pink-500 rounded-xl mr-4 shadow-lg">
                            <FiCalendar className="text-white text-lg" />
                          </div>
                          <span className="text-lg">Delivery Date</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-gray-800 text-lg font-semibold">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-purple-600">
                            {new Date(scanResult.estimateDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">Estimated Delivery</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  onClick={resetScanner}
                  className="flex items-center justify-center flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                >
                  <FiRefreshCw className="mr-3 text-xl" />
                  Scan Another Package
                </button>
                
                <button
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-gray-200 hover:to-gray-300"
                >
                  <FiStar className="mr-3 text-xl" />
                  Save Details
                </button>
              </div>

              {/* Premium Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm font-medium">
                  🔒 Secure & Verified • Smart Postal Management System
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {scanResult?.error && (
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="p-4 bg-red-50 rounded-xl mb-4">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Scanner Error</h3>
              <p className="text-red-600">{scanResult.error}</p>
            </div>
            <button
              onClick={resetScanner}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
