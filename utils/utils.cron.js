// utils/cron.js
const cron = require("node-cron");
const Auction = require("../models/auction.model");

cron.schedule("* * * * *", async () => {
  const now = new Date();

  await Auction.updateMany(
    { end_time: { $lt: now }, status: "active" },
    { status: "closed" }
  );
});