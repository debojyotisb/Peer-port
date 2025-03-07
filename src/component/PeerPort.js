import React, { useState } from "react";
import Connection from "./Connection";
import QRConnect from "./QRConnect";
import { FilePlus, Send, CheckCircle, XCircle } from "lucide-react";

const CHUNK_SIZE = 16384; // 16KB per chunk

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
    
    let receivedChunks = [];
    let receivedFileName = "";

    newPeer.on("data", (data) => {
      if (typeof data === "string") {
        const message = JSON.parse(data);
        if (message.type === "fileInfo") {
          receivedFileName = message.fileName;
          receivedChunks = [];
        } 
        if (message.type === "fileTransferComplete") {
          const receivedFile = new Blob(receivedChunks);
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(receivedFile);
          downloadLink.download = receivedFileName || "received_file";
          downloadLink.click();
          setProgress(100);
        }
      } else {
        receivedChunks.push(data);
        setProgress((prev) => Math.min(prev + 10, 100));
      }
    });
  };

  const handleFileSelection = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);

    if (peer) {
      peer.send(JSON.stringify({ type: "fileInfo", fileName: selectedFiles[0].name }));
    }
  };

  const handleFileTransfer = () => {
    if (files.length === 0) {
      setError("Select a file first.");
      return;
    }

    setProgress(0);
    const file = files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const totalChunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE);
      let offset = 0;
      let chunkIndex = 0;

      const sendNextChunk = () => {
        if (offset < arrayBuffer.byteLength) {
          const chunk = arrayBuffer.slice(offset, offset + CHUNK_SIZE);
          peer.send(chunk);
          offset += CHUNK_SIZE;
          chunkIndex++;
          setProgress(Math.round((chunkIndex / totalChunks) * 100));
          setTimeout(sendNextChunk, 50);
        } else {
          peer.send(JSON.stringify({ type: "fileTransferComplete" }));
        }
      };
      sendNextChunk();
    };
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
