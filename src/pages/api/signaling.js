let peers = {}; // Stores peer connections

export default function handler(req, res) {
  if (req.method === "POST") {
    const { peerId, data } = req.body;

    if (!peerId || !data) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Store signaling data for the peer
    peers[peerId] = data;

    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    const { peerId } = req.query;

    if (!peerId || !peers[peerId]) {
      return res.status(404).json({ error: "Peer not found" });
    }

    res.status(200).json(peers[peerId]);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
