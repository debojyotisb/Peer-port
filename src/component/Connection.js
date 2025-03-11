import React, { useState, useEffect, useRef } from "react";

const Connection = ({ onConnect, peerId }) => {
  const [status, setStatus] = useState("Not Connected");
  const fileTransferUIRef = useRef(null);
  const dataChannelRef = useRef(null);

  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // STUN server
        {
          urls: "turn:relay1.expressturn.com:3478", // TURN server
          username: "expressturn",
          credential: "expressturn",
        },
      ],
    })
  );

  useEffect(() => {
    const checkForSignal = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/signaling?peerId=test");
        if (!response.ok) return;

        const data = await response.json();

        if (data.offer) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          await fetch("/api/signaling", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ peerId, data: { answer } }),
          });
        } else if (data.answer) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } else if (data.candidate) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (error) {
        console.error("Signaling error:", error);
      }
    };

    checkForSignal();
    const interval = setInterval(checkForSignal, 3000);

    return () => clearInterval(interval);
  }, [peerId]);

  // ✅ Send ICE Candidates to Signaling Server
  peerConnection.current.onicecandidate = async (event) => {
    if (event.candidate) {
      await fetch("/api/signaling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId, data: { candidate: event.candidate } }),
      });
    }
  };

  // ✅ Update Connection Status & Show File Transfer UI
  peerConnection.current.onconnectionstatechange = () => {
    setStatus(peerConnection.current.connectionState);
    if (peerConnection.current.connectionState === "connected") {
      setStatus("Connected");

      // ✅ Show File Transfer UI when connected
      if (fileTransferUIRef.current) {
        fileTransferUIRef.current.style.display = "block";
      }

      onConnect(peerConnection.current);
    }
  };

  // ✅ Handle Incoming Data Channel (for file transfer)
  peerConnection.current.ondatachannel = (event) => {
    dataChannelRef.current = event.channel;

    dataChannelRef.current.onopen = () => {
      console.log("Data channel open! Enabling file transfer.");
      
      // ✅ Show File Transfer UI when data channel opens
      if (fileTransferUIRef.current) {
        fileTransferUIRef.current.style.display = "block";
      }
    };
  };

  return (
    <div className="text-center">
      <p>Connection Status: {status}</p>
      {/* File Transfer UI (Initially Hidden) */}
      <div id="fileTransferUI" ref={fileTransferUIRef} style={{ display: "none" }}>
        <p>Ready to send files!</p>
      </div>
    </div>
  );
};

export default Connection;
