// server.js
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const PORT = process.env.PORT || 5000
const app = express();
app.use(cors());
app.use(express.json());

// Auto-close expired auctions every minute
require("./utils/utils.cron");

// ✅ create HTTP server
const server = http.createServer(app);

// ✅ attach socket.io
const io = new Server(server, {
  cors: { origin: "*" }
});

// ✅ make io available everywhere
app.set("io", io);

// ✅ socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
    console.log("Joined room:", auctionId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// DB
mongoose.connect(process.env.MONGO_URI_DEV)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/auctions", require("./routes/auction.routes"));
app.use("/api/bids", require("./routes/bid.routes"));

server.listen(PORT, () => console.log("Server running"));