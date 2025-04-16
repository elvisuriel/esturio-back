import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { uploadFile } from "./controllers/uploadS3Controller.js";
import routes from "./routes/index.js";
import setupWebSocket from "./sockets/socket.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

setupWebSocket(server); // Configura WebSocket

// Redirige todas las solicitudes HTTP a HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Middleware y rutas
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://54.67.30.105:3001", // IP pública del servidor EC2
      "https://esturiofron.netlify.app", // Frontend desplegado en Netlify
      "http://localhost:3000", // Para desarrollo local
      "https://landing.app.esturio.com", // Otro dominio de la app
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.raw({
  type: ["image/*", "audio/*", "video/*", "application/pdf"],
  limit: "50mb",
}));

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Error interno del servidor");
});

// Escuchar el puerto 3001 para HTTP
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en ejecución en http://0.0.0.0:${PORT}`);
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ Hi: "Hello World" });
});

// Rutas API
app.use("/api", routes);
app.post("/api/upload", uploadFile);

export default app;
