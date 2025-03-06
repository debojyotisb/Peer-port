import React from "react";
import QrReader from "react-qr-scanner";

const QRScanner = ({ onScan, onError, onClose }) => {
  const previewStyle = {
    height: 240,
    width: "100%",
  };

  return (
    <div className="qr-scanner-overlay">
      <h3>Scan QR Code</h3>
      <QrReader
        delay={300}
        style={previewStyle}
        onScan={(data) => {
          if (data) {
            console.log("Scanned QR Data:", data); // Debugging
            onScan(data.text || data); // Ensure text exists
          }
        }}
        onError={onError}
      />
      <button className="btn btn-danger mt-2" onClick={onClose}>
        Close Scanner
      </button>
    </div>
  );
};

export default QRScanner;
