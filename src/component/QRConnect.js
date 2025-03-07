import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import QR code generator
import QRScanner from "./QRScanner"; // Import your scanner component

const QRConnect = ({ onScan }) => {
  const [mode, setMode] = useState(null); // "generate" or "scan"
  const [qrData, setQrData] = useState(""); // Data to encode
  const [status, setStatus] = useState("Not Connected");

  const generateQRCode = () => {
    const connectionId = `peerport-${Math.random().toString(36).substr(2, 9)}`;
    setQrData(connectionId); // Set unique connection ID
    setMode("generate");
  };

  const handleScan = (data) => {
    if (data) {
      console.log("Scanned Data:", data);
      setStatus("Connected");
      setMode(null); // Hide scanner after scan
      onScan(data); // Notify parent component
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  return (
    <div>
      <h2>PeerPort</h2>

      {!mode && (
        <div>
          <button className="btn btn-primary" onClick={generateQRCode}>
            Generate QR Code
          </button>
          <button className="btn btn-success" onClick={() => setMode("scan")}>
            Scan QR Code
          </button>
        </div>
      )}

      {mode === "generate" && qrData && (
        <div>
          <h3>Scan this QR to connect</h3>
          <QRCodeCanvas value={qrData} size={200} />
        </div>
      )}

      {mode === "scan" && (
        <QRScanner onScan={handleScan} onError={handleError} onClose={() => setMode(null)} />
      )}

      {status === "Connected" && <p className="text-success">✅ Connected</p>}
    </div>
  );
};

export default QRConnect;
