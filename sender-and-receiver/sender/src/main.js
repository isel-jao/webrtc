import Peer from "peerjs";

const peer = new Peer("sender-id", {
  host: "/",
  port: 3001,
}); // Unique ID for the sender
let localStream;
let call;

// Get user media (video and audio)
async function startStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log("Media stream obtained:", localStream);
    document.getElementById("localVideo").srcObject = localStream;
    document.getElementById("startStream").disabled = true;
    document.getElementById("endStream").disabled = false;
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
}

// Send stream to the receiver
async function sendStream() {
  if (!localStream) return;

  call = peer.call("receiver-id", localStream); // Replace 'receiver-id' with the receiver's ID
  call.on("stream", (remoteStream) => {
    // Handle remote stream if needed
  });
}

// End the stream
function endStream() {
  if (call) {
    call.close();
    call = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  document.getElementById("localVideo").srcObject = null;
  document.getElementById("startStream").disabled = false;
  document.getElementById("endStream").disabled = true;
}

// Event listeners for buttons
document.getElementById("startStream").addEventListener("click", async () => {
  await startStream();
  sendStream();
});

document.getElementById("endStream").addEventListener("click", endStream);

// Handle PeerJS connection
peer.on("open", (id) => {
  console.log("Sender ID:", id);
});

peer.on("connection", (conn) => {
  console.log("Sender connected to:", conn.peer);
});

peer.on("error", (error) => {
  console.error("Sender PeerJS error:", error);
});
