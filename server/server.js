const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;  // Backend runs on a different port
const allowedOrigins = [
    "http://localhost:3000",  // Allow local development
    "https://peer-port.vercel.app"  // Allow production frontend
];

app.use(cors({
    origin: allowedOrigins,
    methods: "GET,POST",
    credentials: true  // Allow cookies if needed
}));

app.use(express.json());  // Parse JSON requests

// API Route for Signaling
app.get("/api/signaling", (req, res) => {
    const { peerId } = req.query;

    if (!peerId) {
        return res.status(400).json({ error: "peerId is required" });
    }

    res.json({ message: `Received peerId: ${peerId}` });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});
