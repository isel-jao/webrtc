import express from "express";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { env } from "./lib/env";

const port = env.PORT || 3000;

const app = express();
const server = new Server(app);
const io = new SocketServer(server);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
