const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;  // Backend runs on a different port

app.use(cors({origin: "http://localhost:3000" }));  // Enable CORS
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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
