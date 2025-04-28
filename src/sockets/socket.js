import { Server } from "socket.io";
import { initWhiteboard, initChat } from "./index.js";

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://azanavariedades.shop",   // Actualiza a HTTPS
        "http://54.67.30.105:3001",      // Tu backend (manténlo igual si tu backend no está en HTTPS)
        "https://esturiofron.netlify.app", // Frontend en Netlify
        "http://localhost:3000",          // Para desarrollo local
        "https://landing.app.esturio.com"  // Otro dominio de la app
      ],
      methods: ["GET", "POST"],
      credentials: true  // Habilita el uso de cookies y credenciales si es necesario
    }
  });

  // Inicializa la pizarra y el chat con las conexiones de Socket.io
  initWhiteboard(io);
  initChat(io);
}

export default setupWebSocket;

