import express, { Application } from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import chatRoutes from "./routes/chatRoutes";
import { SocketService } from './services/socketService';

// Application port; can be overridden via environment variable
const PORT = Number(process.env.PORT || 3000);

// Create and configure the Express application
const app: Application = express();

// Enable CORS (useful if the frontend runs on a different domain)
app.use(cors());

// Enable JSON request body parsing (e.g., for future POST APIs)
app.use(express.json());

// Resolve the path to the static folder; using process.cwd() works in both
// development (ts-node) and production builds (node dist/…)
const publicDir = path.resolve(process.cwd(), "public");
app.use(express.static(publicDir));

// Register REST routes
app.use(chatRoutes);

// Simple health check endpoint for tests
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Create the HTTP server and attach Socket.io to it
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

// Initialize Socket.io service with event listeners
const socketService = new SocketService(io);
socketService.init();

// Start the server
server.listen(PORT, () => {
  console.log(`Mario chat is running on http://localhost:${PORT}`);
});
