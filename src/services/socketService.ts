import { Server as SocketServer, Socket } from "socket.io";
import { ChatMessage, chatModel } from "../models/chatMessage";

// Service responsible for initializing Socket.io and handling client events
export class SocketService {
  constructor(private readonly io: SocketServer) {}

  // Subscribe to the connection event and set up all listeners
  public init(): void {
    this.io.on("connection", (socket: Socket) => {
      // Log which client connected (using socket ID)
      console.log(`Chatter connected: ${socket.id}`);

      // Send the current chat history to the newly connected client
      socket.emit("chat:init", chatModel.getAll());

      // Send updated user count to all clients
      this.emitUserCount();

      // Set up the handler for sending messages
      this.handleSendMessage(socket);

      // Log when a client disconnects; no additional logic needed for now
      socket.on("disconnect", () => {
        console.log(`Chatter disconnected: ${socket.id}`);

        // Update user count on disconnect
        this.emitUserCount();
      });
    });
  }

  private emitUserCount(): void {
    const count = this.io.engine.clientsCount; // Currently connected sockets
    this.io.emit("users:count", count);        // Broadcast to all clients
  }

  // Handle the event triggered when a client sends a new message
  private handleSendMessage(socket: Socket): void {
    socket.on(
      "chat:send",
      (
        payload: { author: string; note: string; text: string },
        callback?: (err?: string) => void
      ) => {
        try {
          // Save the message via the model; validation happens inside the model
          const message: ChatMessage = chatModel.add(
            payload.author,
            payload.note,
            payload.text
          );

          // Broadcast the new message to all connected clients
          this.io.emit("chat:new", message);

          // Notify the sender that the operation was successful
          if (callback) {
            callback();
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not send message";

          // Send an error response back to the sender
          if (callback) {
            callback(message);
          } else {
            socket.emit("chat:error", message);
          }
        }
      }
    );
  }
}
