import React, { useEffect, useRef } from "react";
import jsQR from "jsqr";

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { exact: "environment" } } // Use rear camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Failed to access camera. Check browser permissions.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (qrCode) {
          console.log("Scanned QR Data:", qrCode.data);
          onScan(qrCode.data);
        }
      }
      requestAnimationFrame(scanQRCode);
    };

    requestAnimationFrame(scanQRCode);
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default QRScanner;
