import Peer from "peerjs";

const root = document.getElementById("root");

const messagesContainer = document.createElement("ul");
root.appendChild(messagesContainer);

function addMessage(message) {
  const messageElement = document.createElement("li");
  messageElement.textContent = `${message}`;
  messagesContainer.appendChild(messageElement);
}

const peer = new Peer("sender-id", {
  host: "/",
  port: 3001,
});

const receivers = [];
let localVideoStream = null;

peer.on("open", (id) => {
  console.log("Receiver ID:", id);
});

peer.on("connection", async (conn) => {
  receivers.push(conn.peer);
  addMessage(`Receiver connected: ${conn.peer}`);
  if (!localVideoStream) {
    localVideoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    addMessage("Stream started");
  }
  peer.call(conn.peer, localVideoStream);

  conn.on("close", () => {
    const index = receivers.indexOf(conn.peer);
    if (index > -1) {
      receivers.splice(index, 1);
    }
    addMessage(`Receiver disconnected
    : ${conn.peer} ${receivers.length}`);
    if (receivers.length === 0) {
      addMessage("Stream ended");
      localVideoStream?.getTracks().forEach((track) => track.stop());
      localVideoStream = null;
    }
    peer.call(conn.peer).close();
  });
  conn.on("data", (data) => {
    const message = `${conn.peer} says: ${data}`;
    addMessage(message);
  });
});

peer.on("error", (error) => {
  console.error("Receiver PeerJS error:", error);
});

// // Send stream to the receiver
// async function sendStream() {
//   if (!localStream) return;

//   call = peer.call("receiver-id", localStream); // Replace 'receiver-id' with the receiver's ID
//   call.on("stream", (remoteStream) => {
//     // Handle remote stream if needed
//   });
// }

// // End the stream
// function endStream() {
//   if (call) {
//     call.close();
//     call = null;
//   }
//   if (localStream) {
//     localStream.getTracks().forEach((track) => track.stop());
//     localStream = null;
//   }
//   document.getElementById("localVideo").srcObject = null;
//   document.getElementById("startStream").disabled = false;
//   document.getElementById("endStream").disabled = true;
// }

// // Event listeners for buttons
// document.getElementById("startStream").addEventListener("click", async () => {
//   await startStream();
//   sendStream();
// });

// document.getElementById("endStream").addEventListener("click", endStream);

// // Handle PeerJS connection
// peer.on("open", (id) => {
//   console.log("Sender ID:", id);
// });

// peer.on("connection", (conn) => {
//   console.log("Sender connected to:", conn.peer);
// });

// peer.on("error", (error) => {
//   console.error("Sender PeerJS error:", error);
// });
