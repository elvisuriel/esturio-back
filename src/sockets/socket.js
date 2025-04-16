import { Server } from "socket.io";
import { initWhiteboard, initChat } from "./index.js";

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://54.67.30.105:3001", // IP pública del servidor EC2
        "https://esturiofron.netlify.app", // Frontend desplegado en Netlify
        "http://localhost:3000", // Para desarrollo local
        "https://landing.app.esturio.com", // Otro dominio de la app
      ],
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],  // Permitir encabezados como Content-Type y Authorization
      credentials: true, // Asegurarse de que se permiten las cookies si se están utilizando
    },
  });

  // Inicializar los módulos de la pizarra y el chat
  initWhiteboard(io);
  initChat(io);
}

export default setupWebSocket;
