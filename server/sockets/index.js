import { Server } from "socket.io";
import initializeAuthNamespace from "./socketsNamespaces/authNamespace.js";

/** @type {Server} */
let io;

/** @param {Server} httpServer */
export function initializeSocketIO(httpServer) {
  io = new Server(httpServer);

 const authNamespace = io.of('/auth');
 initializeAuthNamespace(authNamespace);
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
