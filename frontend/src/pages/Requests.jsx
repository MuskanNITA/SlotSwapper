import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  async function load() {
    const res = await API.get("/swap-requests");
    setIncoming(res.data.incoming);
    setOutgoing(res.data.outgoing);
  }

  async function respond(requestId, accept) {
    try {
      await API.post(`/swap-response/${requestId}`, { accept });
      alert(accept ? "Swap accepted!" : "Swap rejected!");
      load(); // refresh the list after updating
    } catch (err) {
      console.error(err);
      alert("Error responding to swap.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "flex", gap: 30 }}>
      <div style={{ flex: 1 }}>
        <h3>Incoming</h3>
        {incoming.length === 0 && <p>No incoming requests</p>}
        {incoming.map((r) => (
          <div
            key={r._id}
            style={{ border: "1px solid #ccc", padding: 10, margin: 8 }}
          >
            <p>
              From: <strong>{r.requester?.name || "Unknown"}</strong>
            </p>
            <p>Their slot: {r.theirSlot?.title}</p>
            <p>Your slot: {r.mySlot?.title}</p>
            <p>Status: {r.status}</p>

            {r.status === "PENDING" && (
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => respond(r._id, true)}
                  style={{ marginRight: 10 }}
                >
                  Accept
                </button>
                <button onClick={() => respond(r._id, false)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <h3>Outgoing</h3>
        {outgoing.length === 0 && <p>No outgoing requests</p>}
        {outgoing.map((r) => (
          <div
            key={r._id}
            style={{ border: "1px solid #ccc", padding: 10, margin: 8 }}
          >
            <p>
              To: <strong>{r.responder?.name || "Unknown"}</strong>
            </p>
            <p>Their slot: {r.theirSlot?.title}</p>
            <p>Your slot: {r.mySlot?.title}</p>
            <p>Status: {r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
