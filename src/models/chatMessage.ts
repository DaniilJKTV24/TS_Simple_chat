export interface ChatMessage {
  // Unique ID used for rendering lists and debugging history
  id: number;
  // Name of the sender, displayed in the UI
  author: string;
  // Message content
  text: string;
  // Timestamp (UTC, ms) used to display human-readable time on the client
  timestamp: number;
}

// A simple in-memory chat message store
export class ChatModel {
  // Message storage; kept in server memory only
  private messages: ChatMessage[] = [];
  // Counter for generating unique IDs
  private nextId = 1;
  // Maximum number of messages to keep in history
  private readonly maxMessages = 100;

  // Return a copy of the messages array to prevent external mutation
  public getAll(): ChatMessage[] {
    return [...this.messages];
  }

  // Add a new message and return it so it can be sent to clients
  public add(author: string, text: string): ChatMessage {
    const trimmedAuthor = author.trim() || "Anonymous";
    const trimmedText = text.trim();

    // Ignore empty messages to avoid cluttering the chat
    if (!trimmedText) {
      throw new Error("Message text cannot be empty");
    }

    const message: ChatMessage = {
      id: this.nextId++,
      author: trimmedAuthor.slice(0, 30), // Limit name length
      text: trimmedText.slice(0, 500), // Limit message size
      timestamp: Date.now(),
    };

    this.messages.push(message);

    // Remove the oldest message if history exceeds the limit
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    return message;
  }
}

// Singleton-style model instance, reused across the entire app
export const chatModel = new ChatModel();
