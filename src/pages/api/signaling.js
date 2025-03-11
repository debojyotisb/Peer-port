let peers = {};
export default function handler(req, res) {
    try {
      if (req.method === "POST") {
        const { peerId, data } = req.body;
  
        if (!peerId || !data) {
          return res.status(400).json({ error: "Invalid request" });
        }
  
        // Store signaling data for the peer
        peers[peerId] = data;
        return res.status(200).json({ success: true });
      } 
      
      else if (req.method === "GET") {
        const { peerId } = req.query;
  
        if (!peerId) {
          return res.status(400).json({ error: "Peer ID is required" });
        }
  
        if (!peers[peerId]) {
          return res.status(404).json({ error: "Peer not found" });
        }
  
        return res.status(200).json({ peerData: peers[peerId] });
      } 
      
      else {
        return res.status(405).json({ error: "Method Not Allowed" });
      }
    } catch (error) {
      console.error("Signaling Server Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  