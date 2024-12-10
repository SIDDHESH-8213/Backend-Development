const { Server } = require("socket.io");

const onlineUsers = new Map();

const initSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("typing", (data) => {
      socket.to(data.receiver).emit("userTyping", { sender: data.sender });
    });

    socket.on("stopTyping", (data) => {
      socket.to(data.receiver).emit("userStoppedTyping", { sender: data.sender });
    });

    socket.on("sendMessage", (message) => {
      const { receiver } = message;
      if (onlineUsers.has(receiver)) {
        socket.to(onlineUsers.get(receiver)).emit("receiveMessage", message);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) onlineUsers.delete(userId);
      });
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = initSocket;
