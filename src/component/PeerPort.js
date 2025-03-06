import React, { useState } from "react";
import Connection from "./Connection";
import QRConnect from "./QRConnect";
import { FilePlus, Send, CheckCircle, XCircle } from "lucide-react";

const PeerPort = () => {
  const [connected, setConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleConnect = (peer) => {
    console.log("Connected to peer", peer);
    setConnected(true);
  };

  const handleFileSelection = (e) => {
    setFiles([...e.target.files]);
  };

  const handleFileTransfer = () => {
    if (files.length === 0) {
      setError("Select a file first.");
      return;
    }
    setProgress(0);
    setTimeout(() => setProgress(100), 3000);
  };

  return (
    <div className="container text-center">
      {/* <h1>PeerPort</h1> */}

      <Connection onConnect={handleConnect} />
      {!connected && <QRConnect connectionId="peer-1234" onScan={() => setConnected(true)} />}

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
