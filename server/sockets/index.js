import { Server } from "socket.io";
import initializeAuthNamespace from "./socketsNamespaces/authNamespace.js";

/** @type {Server} */
let io;

/** @param {Server} httpServer */
export function initializeSocketIO(httpServer) {
  io = new Server(httpServer);

  io.on('connection', () => {
    console.log("New user connect");
  })

 const authNamespace = io.of('/auth/');
 initializeAuthNamespace(authNamespace);
}

/** @returns {Server} */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
