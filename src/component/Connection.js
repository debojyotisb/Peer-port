import React, { useState, useEffect, useRef } from "react";

const Connection = ({ onConnect }) => {
  const [status, setStatus] = useState("Not Connected");
  const peerConnection = useRef(new RTCPeerConnection());
  const socket = new WebSocket("wss://192.168.1.8:8080");


  useEffect(() => {
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.offer) {
        peerConnection.current.setRemoteDescription(message.offer);
        peerConnection.current.createAnswer().then((answer) => {
          peerConnection.current.setLocalDescription(answer);
          socket.current.send(JSON.stringify({ answer }));
        });
      } else if (message.answer) {
        peerConnection.current.setRemoteDescription(message.answer);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      setStatus(peerConnection.current.connectionState);
      if (peerConnection.current.connectionState === "connected") {
        onConnect(peerConnection.current);
      }
    };
  }, [onConnect]);

  return <div className="text-center">Connection Status: {status}</div>;
};

export default Connection;
