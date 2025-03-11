// import React from "react";
// import QrReader from "react-qr-scanner";

// const QRScanner = ({ onScan }) => {
//   const previewStyle = {
//     height: 240, 
//     width: "100%",
//     // maxWidth: "250px", // Limit size on larger screens
//   };

//   return (
//     <div className="qr-scanner-overlay text-center">
//       <h3>Scan QR Code</h3>
//       <QrReader
//         delay={300}
//         style={previewStyle}
//         constraints={{
//           video: { facingMode: "environment" }, // Use rear camera
//         }}
//         onScan={(data) => {
//           if (data) {
//             console.log("Scanned QR Data:", data);
//             onScan(data.text || data);
//           }
//         }}
//         onError={(err) => console.error("QR Scanner Error:", err)}
//       />
//     </div>
//   );
// };

// export default QRScanner;


import React, { useEffect, useRef } from "react";

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is not supported on this device or browser.");
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Failed to access camera. Please check browser permissions.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default QRScanner;