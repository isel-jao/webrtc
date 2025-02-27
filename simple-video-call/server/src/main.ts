import express, { Request } from "express";
import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { env } from "./lib/env";
import { verify, sign } from "jsonwebtoken";
import cors from "cors";

type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  socketId?: string;
};

type Room = {
  id: string;
  name: string;
  users: User[];
};

type RequestWithUser = Request & { user: User };
type SocketWithUser = Socket & { user: User };

const users: User[] = [
  {
    id: uuidv4(),
    email: "admin@dakai.io",
    password: "1234567890",
    name: "admin admin",
  },
  {
    id: uuidv4(),
    email: "waza@email.com",
    password: "waza@email.com",
    name: "waza waza",
  },
];
const rooms: Room[] = [
  {
    id: uuidv4(),
    name: "General",
    users: [],
  },
];

const port = env.PORT || 3000;
const secret = env.JWT_SECRET;
const expiresIn = env.JWT_EXPIRES_IN;

function generateAccessToken(user: User) {
  return sign({ email: user.email, name: user.name }, secret, {
    expiresIn: expiresIn as any,
  });
}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    res.status(404).send("Invalid email or password");
    return;
  }
  const accessToken = generateAccessToken(user);
  res.send({ user, accessToken });
});

app.post("/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  const user = users.find((u) => u.email === email);
  if (user) {
    res.status(409).send("User already exists");
    return;
  }
  const token = uuidv4();
  const newUser = {
    id: uuidv4(),
    email,
    password,
    name,
    socketId: token,
  };
  const accessToken = generateAccessToken(newUser);
  users.push(newUser);
  res.send({ user: newUser, accessToken });
});

app.use((req: RequestWithUser, res, next) => {
  const authHeader = req.headers.authorization;
  const path = req.path;
  if ("/socket.io/" === path) {
    next();
    return;
  }

  if (!authHeader) {
    res.status(401).send("Unauthorized");
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token, secret) as any;
    const user = users.find((u) => u.email === decoded.email);
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
});

app.get("/auth/me", (req: RequestWithUser, res) => {
  res.send(req.user);
});

app.get("/rooms", (req: RequestWithUser, res) => {
  res.send(rooms);
});

app.get("/rooms/:id", (req: RequestWithUser, res) => {
  const room = rooms.find((r) => r.id === req.params.id);
  if (!room) {
    res.status(404).send("Room not found");
    return;
  }
  res.send(room);
});

app.get("/users", (req: RequestWithUser, res) => {
  res.send(users);
});

app.get("/users/:id", (req: RequestWithUser, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  res.send(user);
});

const server = new Server(app);
const io = new SocketServer(server, {
  allowUpgrades: true,
  cors: {
    origin: "*",
  },
});

io.use((socket: SocketWithUser, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Unauthorized"));
  }
  try {
    const decoded = verify(token, secret) as any;
    const user = users.find((u) => u.email === decoded.email);
    if (!user) {
      return next(new Error("Unauthorized"));
    }
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket: SocketWithUser) => {
  const user = socket.user;
  user.socketId = socket.id;
  console.log("a user connected:".padEnd(20, " "), user.name);

  socket.on("create-room", (name: string) => {
    const room = {
      id: uuidv4(),
      name,
      sender: user,
      users: [user],
    };
    rooms.push(room);
    socket.join(room.id);
    io.emit("room-created", room);
  });

  socket.on("disconnect", () => {
    // Remove user from rooms
    rooms.forEach((room) => {
      const index = room.users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        room.users.splice(index, 1);
        io.to(room.id).emit("user-left", user);
      }
    });
    console.log("a user disconnected:".padEnd(20, " "), user.name);
  });

  socket.on("join-room", (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      socket.emit("room-not-found");
      return;
    }
    socket.join(room.id);
    // check if user already joined
    const index = room.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      return;
    }
    room.users.push(user);
    io.to(room.id).emit("user-joined", user);
  });

  socket.on("leave-room", (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      socket.emit("room-not-found");
      return;
    }
    const index = room.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      room.users.splice(index, 1);
      io.to(room.id).emit("user-left", user);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
