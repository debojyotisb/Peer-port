import React, { useState, useEffect, useRef } from "react";

const Connection = ({ onConnect }) => {
  const [status, setStatus] = useState("Not Connected");
  const peerConnection = useRef(new RTCPeerConnection());
  const socketRef = useRef(null);

  useEffect(() => {
    // Use `ws://` instead of `wss://` if running locally without SSL
    socketRef.current = new WebSocket("ws://192.168.1.8:8080");

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
      setStatus("Connected");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("Error");
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.offer) {
        peerConnection.current.setRemoteDescription(message.offer);
        peerConnection.current.createAnswer().then((answer) => {
          peerConnection.current.setLocalDescription(answer);
          socketRef.current.send(JSON.stringify({ answer }));
        });
      } else if (message.answer) {
        peerConnection.current.setRemoteDescription(message.answer);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      setStatus(peerConnection.current.connectionState);
      if (peerConnection.current.connectionState === "connected") {
        onConnect(peerConnection.current);
      }
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
      peerConnection.current.close();
    };
  }, [onConnect]);

  return <div className="text-center">Connection Status: {status}</div>;
};

export default Connection;
