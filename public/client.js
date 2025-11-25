(() => {
  // Cache commonly used DOM elements for later use
  const messagesEl = document.getElementById('messages');
  const authorEl = document.getElementById('author');
  const messageEl = document.getElementById('message');
  const sendBtn = document.getElementById('send');
  const feedbackEl = document.getElementById('feedback');
  const statusPill = document.getElementById('status-pill');

  // Establish a connection to the Socket.io server
  const socket = io();

  // Load previously saved user name from localStorage, if available
  const savedName = localStorage.getItem("mkchat:name");
  if (savedName && authorEl instanceof HTMLInputElement) {
    authorEl.value = savedName;
  }

  // Utility function to update the server status indicator
  const setStatus = (text, online) => {
    statusPill.textContent = text;
    statusPill.classList.toggle("status-pill--online", online);
    statusPill.classList.toggle("status-pill--offline", !online);
  };

  // Format timestamps into a readable local time
  const formatTime = (timestamp) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(timestamp));
    } catch {
      return "";
    }
  };

  // Create a DOM element for a single message
  const createMessageElement = (message) => {
    const container = document.createElement("article");
    container.className = "message";

    const meta = document.createElement("div");
    meta.className = "message__meta";

    const author = document.createElement("span");
    author.className = "message__author";
    author.textContent = message.author;

    const time = document.createElement("time");
    time.className = "message__time";
    time.textContent = formatTime(message.timestamp);

    meta.append(author, time);

    const text = document.createElement("p");
    text.className = "message__text"; // fixed typo
    text.textContent = message.text;

    container.append(meta, text);
    return container;
  };

  // Render the full message history
  const renderMessages = (messages) => {
    messagesEl.innerHTML = "";
    messages.forEach((m) => {
      messagesEl.appendChild(createMessageElement(m));
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  // Append a single message to the end of the message list
  const appendMessage = (message) => {
    messagesEl.appendChild(createMessageElement(message));
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  // Display a feedback message to the user
  const showFeedback = (text, isError = false) => {
    feedbackEl.textContent = text;
    feedbackEl.classList.toggle("feedback--error", isError);
  };

  // Load message history from the server via REST
  const loadHistory = async () => {
    try {
      const response = await fetch("api/messages");
      if (!response.ok) {
        throw new Error("Failed to load message history");
      }

      const data = await response.json();
      renderMessages(data.messages || []);
      showFeedback("History loaded successfully");
    } catch (error) {
      console.error(error);
      showFeedback("Could not load message history", true);
    }
  };

  // Send a message to the server
  const sendMessage = () => {
    const author = authorEl.value.trim() || "Anonymous";
    const text = messageEl.value.trim();

    if (!text) {
      showFeedback("Please type a message before sending", true);
      return;
    }

    // Save the user name in localStorage for convenience
    localStorage.setItem("mkchat:name", author);

    sendBtn.disabled = true;
    showFeedback("Sending...");

    socket.emit("chat:send", { author, text }, (err) => {
      sendBtn.disabled = false;
      if (err) {
        showFeedback(err, true);
        return;
      }

      messageEl.value = "";
      messageEl.focus();
      showFeedback("Message sent!");
    });
  };

  // Initialize the app: load history and attach event listeners
  const init = () => {
    loadHistory();

    sendBtn.addEventListener("click", sendMessage);

    messageEl.addEventListener("keydown", (event) => {
      // Send message on Ctrl/Cmd + Enter, similar to common messengers
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  };

  // Socket.io event subscriptions
  socket.on("connect", () => setStatus("Online", true));
  socket.on("disconnect", () => setStatus("Offline", false));

  // Receive full chat history from server upon connection
  socket.on("chat:init", (messages) => renderMessages(messages));

  // Append new messages sent by any user
  socket.on("chat:new", (message) => appendMessage(message));

  // Handle server-side errors not delivered via callback
  socket.on("chat:error", (msg) => showFeedback(msg, true));

  // Start initialization when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
