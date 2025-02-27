import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
const receivedId = `receiver-${uuidv4()}`;
const peer = new Peer("receiver-id", {
  host: "/",
  port: 3001,
});

// Handle incoming call
peer.on("call", (call) => {
  console.log("Incoming call from:", call.peer);
  call.answer(); // Answer the call

  call.on("stream", (remoteStream) => {
    console.log("Remote stream received:", remoteStream);
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.srcObject = remoteStream;

    console.log("Video element srcObject:", remoteVideo.srcObject);

    // Show the play button
    // const playButton = document.getElementById("playButton");
    // playButton.style.display = "block";

    // // Wait for user interaction to play the video
    // playButton.addEventListener("click", () => {
    //   remoteVideo
    //     .play()
    //     .then(() => {
    //       console.log("Video is playing");
    //       playButton.style.display = "none"; // Hide the button after playing
    //     })
    //     .catch((error) => {
    //       console.error("Error playing video:", error);
    //     });
    // });
  });
});

// Handle PeerJS connection
peer.on("open", (id) => {
  console.log("Receiver ID:", id);
});

peer.on("connection", (conn) => {
  console.log("Receiver connected to:", conn.peer);
});

peer.on("error", (error) => {
  console.error("Receiver PeerJS error:", error);
});
