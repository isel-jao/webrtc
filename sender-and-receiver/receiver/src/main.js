import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

// get id from url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const root = document.getElementById("root");

const form = document.createElement("form");
form.id = "form";
root.appendChild(form);

const input = document.createElement("input");
input.id = "input";
input.type = "text";
input.placeholder = "Enter message";
form.appendChild(input);

const button = document.createElement("button");
button.id = "button";
button.type = "submit";
button.textContent = "Send";
form.appendChild(button);

const receivedId = id || `receiver-${uuidv4()}`;
console.log({ receivedId, id });

const senderId = "sender-id";

const peer = new Peer(receivedId, {
  host: "/",
  port: 3001,
});

peer.on("open", (id) => {
  console.log("Receiver ID:", id);
});

peer.on("connection", (conn) => {
  console.log("Receiver connected to:", conn.peer);
});

peer.on("error", (error) => {
  console.error("Receiver PeerJS error:", error);
});

const conn = peer.connect(senderId);

conn.on("open", () => {
  console.log("Receiver connected to sender");
});

conn.on("data", (data) => {
  console.log("Receiver received data:", data);
});

conn.on("error", (error) => {
  console.error("Receiver connection error:", error);
});

peer.on("call", (call) => {
  console.log("Incoming call from:", call.peer);
  call.answer(); // Answer the call

  call.on("stream", (remoteStream) => {
    console.log("Remote stream received:", remoteStream);
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.srcObject = remoteStream;
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("input");
  const message = input.value;

  conn.send(message);
  input.value = "";
});

window.addEventListener("beforeunload", () => {
  peer.destroy();
});
