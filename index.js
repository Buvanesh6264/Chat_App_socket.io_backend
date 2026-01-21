const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./src/routes/userRoute");
const chatRoute = require("./src/routes/chatRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);

app.get("/", (req, res) => {
  res.send("welcome to my chat app api by buvanesh");
});

const port = process.env.PORT || 5000;
const url = process.env.ATLAS_URL;

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log("connection failed to db", e.message);
  });
