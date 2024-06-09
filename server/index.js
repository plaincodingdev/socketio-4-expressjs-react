const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const messages = ["Initial message from server"]; // Holds the messages on the server

// Enabling CORS for any unknown origin
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const io = require("socket.io")(server, { cors: { origin: "*" } });

// Listen for new connection
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // Send the messages to the client
  socket.emit("messages", { messages }); // First parameter is the event name, second is the data

  // Listen for new message from the client
  socket.on("newMessage", (data) => {
    messages.push(data);
    io.emit("messages", { messages }); // Send the updated messages to all clients
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});
