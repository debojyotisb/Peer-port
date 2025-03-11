import React, { useState, useEffect, useRef } from "react";

const Connection = ({ onConnect, peerId }) => {
  const [status, setStatus] = useState("Not Connected");
  const peerConnection = useRef(new RTCPeerConnection());

  useEffect(() => {
    const checkForSignal = async () => {
      try {
        const response = await fetch(`/api/signaling?peerId=${peerId}`);
        if (!response.ok) return;
        
        const data = await response.json();
        if (data.offer) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          // Send answer to signaling server
          await fetch("/api/signaling", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ peerId, data: { answer } }),
          });
        } else if (data.answer) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } catch (error) {
        console.error("Signaling error:", error);
      }
    };

    checkForSignal();
    const interval = setInterval(checkForSignal, 3000); // Polling every 3 sec
    return () => clearInterval(interval);
  }, [peerId]);

  peerConnection.current.onicecandidate = async (event) => {
    if (event.candidate) {
      await fetch("/api/signaling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId, data: { candidate: event.candidate } }),
      });
    }
  };

  peerConnection.current.onconnectionstatechange = () => {
    setStatus(peerConnection.current.connectionState);
    if (peerConnection.current.connectionState === "connected") {
      setStatus("Connected");
      onConnect(peerConnection.current);
    }
  };

  return <div className="text-center">Connection Status: {status}</div>;
};

export default Connection;
