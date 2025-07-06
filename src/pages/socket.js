import { io } from "socket.io-client";

const url = import.meta.env.VITE_BACKEND_URL;
const socket = io(url, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
