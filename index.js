const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const userRoute = require("./src/routes/userRoute");
const chatRoute = require("./src/routes/chatRoute");
const messageRoute = require("./src/routes/messageRoute");
const { initSocket, setupSocketEvents } = require("./src/socket/socketio");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = initSocket(server);
setupSocketEvents();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/message", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome to my chat app API by Buvanesh");
});

const port = process.env.PORT || 5000;
const url = process.env.ATLAS_URL;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Socket.io server is running on port: ${port}`);
});

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log("Connection failed to MongoDB:", e.message);
  });