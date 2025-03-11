import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QRScanner from "./QRScanner";

const QRConnect = ({ onScan }) => {
  const [mode, setMode] = useState(null);
  const [qrData, setQrData] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState("Not Connected");

  const generateQRCode = () => {
    const connectionId = `peerport-${Math.random().toString(36).substr(2, 9)}`;
    setQrData(connectionId);
    setMode("generate");
  };

  const generateManualCode = () => {
    const manualId = `peerport-${Math.random().toString(36).substr(2, 9)}`;
    setManualCode(manualId);
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      console.log("Manual Code Entered:", manualCode);
      setStatus("Connected");
      setMode(null);
      onScan(manualCode);
    }
  };

  return (
    <div className="text-center container">
      <h2>PeerPort</h2>

      {/* QR Code and Scan Buttons */}
      <div>
        <button className="btn btn-primary mx-2" onClick={generateQRCode}>
          Generate QR Code
        </button>
        <button className="btn btn-success mx-2" onClick={() => setMode("scan")}>
          Scan QR Code
        </button>
      </div>

      {/* QR Code Display */}
      {mode === "generate" && qrData && (
        <div className="mt-3">
          <h3>Scan this QR to connect</h3>
          <QRCodeCanvas value={qrData} size={200} />
        </div>
      )}

      {/* QR Scanner */}
      {mode === "scan" && (
        <div className="qr-scanner-box mt-3">
          <h3>Scan QR Code</h3>
          <QRScanner onScan={(data) => {
            if (data) {
              console.log("Scanned QR Data:", data);
              setStatus("Connected");
              setMode(null);
              onScan(data);
            }
          }} />
        </div>
      )}

      {/* Manual Code Section */}
      <div className="manual-code-section mt-4">
        <h3>Manual Code Option</h3>
        <button className="btn btn-warning my-2" onClick={generateManualCode}>
          Generate Manual Code
        </button>

        {/* Display Generated Manual Code */}
        {manualCode && (
          <h4 className="bg-light p-2 rounded">{manualCode}</h4>
        )}

        {/* Manual Code Input */}
        <p className="mt-3">Enter the manual code if QR scan doesn’t work:</p>
        <input
          type="text"
          className="form-control w-100"
          placeholder="Enter manual code"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />
        <button className="btn btn-primary mt-2 w-100" onClick={handleManualEntry}>
          Connect
        </button>
      </div>

      {status === "Connected" && <p className="text-success mt-2">✅ Connected</p>}
    </div>
  );
};

export default QRConnect;
