import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function ScanQR() {
  const [scanResult, setScanResult] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Parcel QR Code</h1>

      {/* QR Scanner */}
      <div className="w-[300px] h-[300px] bg-white shadow-lg rounded-lg overflow-hidden">
        <QrReader
          constraints={{ facingMode: "environment" }} // use back camera on mobile
          onResult={(result, error) => {
            if (!!result) {
              try {
                // Parse the QR JSON (from your generateQRData)
                setScanResult(JSON.parse(result?.text));
              } catch (err) {
                setScanResult({ error: "Invalid QR data" });
              }
            }
            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Show details if scanned */}
      {scanResult && !scanResult.error && (
        <div className="mt-6 w-full max-w-md bg-white shadow-md rounded-lg p-4 text-left">
          <h2 className="text-xl font-bold mb-2">Parcel Details</h2>
          <p><strong>Parcel ID:</strong> {scanResult.parcelID}</p>
          <p><strong>Name:</strong> {scanResult.name}</p>
          <p><strong>Email:</strong> {scanResult.email}</p>
          <p><strong>Address:</strong> {scanResult.address}</p>
          <p><strong>Details:</strong> {scanResult.details}</p>
          <p><strong>Estimate Date:</strong> {new Date(scanResult.estimateDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {scanResult.status}</p>
        </div>
      )}

      {scanResult?.error && (
        <p className="text-red-500 mt-4">{scanResult.error}</p>
      )}
    </div>
  );
}
