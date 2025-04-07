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

// Middleware y rutas
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://3.238.205.13:3001", "http://localhost:5173", "http://localhost:3000", "https://landing.app.esturio.com"],
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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en ejecución en http://0.0.0.0:${PORT}`);
});


app.get("/", (req, res) => {
  res.json({ Hi: "Hello World" });
});
app.use("/api", routes);
app.post("/api/upload", uploadFile);






export default app;
