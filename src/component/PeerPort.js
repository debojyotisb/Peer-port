import React, { useState } from "react";
import Connection from "./Connection";
import QRConnect from "./QRConnect";
import { FilePlus, Send, CheckCircle, XCircle } from "lucide-react";

const PeerPort = () => {
  const [connected, setConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [peer, setPeer] = useState(null);

  const handleConnect = (newPeer) => {
    console.log("Connected to peer", newPeer);
    setPeer(newPeer);
    setConnected(true);

    // Listening for incoming messages from the peer
    newPeer.on("data", (data) => {
      const message = JSON.parse(data);
      if (message.type === "fileSelected") {
        alert(`Peer selected files: ${message.files.join(", ")}`);
      }
      if (message.type === "fileTransferStarted") {
        setProgress(50);
      }
      if (message.type === "fileTransferCompleted") {
        setProgress(100);
      }
    });
  };

  const handleFileSelection = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);

    if (peer) {
      peer.send(JSON.stringify({ type: "fileSelected", files: selectedFiles.map(f => f.name) }));
    }
  };

  const handleFileTransfer = () => {
    if (files.length === 0) {
      setError("Select a file first.");
      return;
    }

    setProgress(0);
    if (peer) {
      peer.send(JSON.stringify({ type: "fileTransferStarted" }));
    }

    setTimeout(() => {
      setProgress(100);
      if (peer) {
        peer.send(JSON.stringify({ type: "fileTransferCompleted" }));
      }
    }, 3000);
  };

  return (
    <div className="container text-center">
      <Connection onConnect={handleConnect} />
      {!connected && <QRConnect onScan={() => setConnected(true)} />}

      {connected && (
        <>
          <input type="file" className="d-none" id="fileInput" onChange={handleFileSelection} />
          <label htmlFor="fileInput" className="btn btn-outline-primary">
            <FilePlus /> Select Files
          </label>

          <button className="btn btn-success mt-3" onClick={handleFileTransfer}>
            <Send /> Send File
          </button>

          {progress > 0 && (
            <div className="progress mt-3">
              <div className="progress-bar" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          )}

          {progress === 100 && <div className="mt-3 text-success"><CheckCircle /> Transfer Complete</div>}
        </>
      )}

      {error && <div className="text-danger mt-3"><XCircle /> {error}</div>}
    </div>
  );
};

export default PeerPort;
