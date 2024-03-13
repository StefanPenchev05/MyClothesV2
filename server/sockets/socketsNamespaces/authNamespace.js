import { Namespace } from "socket.io";

/** 
 * Initializes the /auth namespace.
 * @param {Namespace} namespace - The namespace to initialize.
 */
export default function initializeAuthNamespace(namespace) {
    // Listen for new connections to the namespace
    namespace.on("connection", (socket) => {
        // When a 'registerUserId' event is received, join the socket to a room with the same name as the user ID
        socket.on("/register/verify", (userId) => {
            socket.join(userId);
        });

        socket.on("login/2FA/:token", (token) => {

        })
    });
}