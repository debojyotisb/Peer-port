// const WebSocket = require("ws");

// const server = new WebSocket.Server({ port: 8080 });

// server.on("connection", (socket) => {
//   console.log("New client connected!");

//   socket.on("message", (message) => {
//     console.log("Received:", message);
//     // Broadcast the message to all connected clients
//     server.clients.forEach((client) => {
//       if (client !== socket && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   socket.on("close", () => console.log("Client disconnected"));
// });

// console.log("WebSocket server running on ws://192.168.1.8:8080");


const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");

// Load SSL Certificate (Use self-signed certs for local testing)
const server = https.createServer({
  cert: fs.readFileSync("server-cert.pem"),
  key: fs.readFileSync("server-key.pem"),
});

const wss = new WebSocket.Server({ port: 8080, perMessageDeflate: false });

wss.on("connection", (socket) => {
  console.log("New client connected!");

  socket.on("message", (message) => {
    console.log("Received:", message);
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on("close", () => console.log("Client disconnected"));
});

server.listen(8080, () => {
  console.log("WebSocket server running on **wss://192.168.1.8:8080**");
});

