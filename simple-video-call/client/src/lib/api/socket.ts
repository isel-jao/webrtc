import { io } from "socket.io-client";
import { env } from "../env";

const accessToken = window.localStorage.getItem("accessToken");
const socket = io(env.VITE_BACKEND_URL, {
  auth: {
    token: accessToken,
  },
});

export { socket };
