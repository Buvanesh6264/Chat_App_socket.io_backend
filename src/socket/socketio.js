const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  return io;
};

const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

const setupSocketEvents = () => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Store user ID if authenticated
    socket.on("authenticate", (userId) => {
      socket.userId = userId;
      socket.join(`user_${userId}`);
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
      
      // Broadcast online status
      socket.broadcast.emit("user_online", {
        userId,
        socketId: socket.id,
        timestamp: new Date()
      });
    });

    // Join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Socket ${socket.id} joined chat: ${chatId}`);
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`Socket ${socket.id} left chat: ${chatId}`);
    });

    // Send message to chat
    socket.on("send_message", async (data) => {
      const { chatId, message, senderId } = data;
      
      // Emit to everyone in the chat room including sender
      io.to(`chat_${chatId}`).emit("new_message", {
        ...data,
        timestamp: new Date(),
        messageId: Date.now().toString() // Temporary ID
      });

      // Save message to database (you can call your message service here)
      console.log(`Message sent to chat ${chatId}:`, message);
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { chatId, userId, isTyping } = data;
      socket.to(`chat_${chatId}`).emit("user_typing", {
        userId,
        isTyping,
        chatId
      });
    });

    // Message read receipt
    socket.on("message_read", (data) => {
      const { messageId, chatId, userId } = data;
      io.to(`chat_${chatId}`).emit("message_read_receipt", {
        messageId,
        userId,
        readAt: new Date()
      });
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      
      if (socket.userId) {
        socket.broadcast.emit("user_offline", {
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });

    // Error handler
    socket.on("error", (error) => {
      console.error("Socket error for", socket.id, ":", error);
    });
  });
};

module.exports = {
  initSocket,
  getSocketIO,
  setupSocketEvents
};