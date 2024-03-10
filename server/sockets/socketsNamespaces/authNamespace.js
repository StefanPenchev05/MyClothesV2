export default function initializeAuthNamespace(namespace) {
    namespace.on('connection', (socket) => {
      console.log('a user connected to the /auth namespace');
    });
  }