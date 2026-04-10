const Bid = require("../models/bid.model");
const Auction = require("../models/auction.model");

exports.placeBid = async (req, res) => {
  try {
    const { auction_id, bid_amount } = req.body;

    // 🔍 1. Basic validation
    if (!auction_id || !bid_amount) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (bid_amount <= 0) {
      return res.status(400).json({ msg: "Invalid bid amount" });
    }

    // 🔍 2. Find auction
    const auction = await Auction.findById(auction_id);

    if (!auction) {
      return res.status(404).json({ msg: "Auction not found" });
    }

    // 🔍 3. Check auction status
    if (auction.status !== "active") {
      return res.status(400).json({ msg: "Auction is not active" });
    }

    // 🔍 4. Time validation
    const now = new Date();
    if (now < auction.start_time || now > auction.end_time) {
      return res.status(400).json({ msg: "Auction not in valid time range" });
    }

    // 🔍 5. Prevent seller from bidding
    if (auction.seller_id.toString() === req.user.id) {
      return res.status(403).json({ msg: "Seller cannot bid" });
    }

    // 🔍 6. Check bid value
    if (bid_amount <= auction.current_highest_bid) {
      return res.status(400).json({ msg: "Bid must be higher than current highest bid" });
    }

    // 🔥 7. Create bid
    const bid = await Bid.create({
      auction_id,
      bidder_id: req.user.id,
      bid_amount
    });

    // 🔥 8. Update auction
    auction.current_highest_bid = bid_amount;
    auction.highest_bidder_id = req.user.id;
    await auction.save();

    // 🔥 9. Emit socket event (REAL-TIME)
    const io = req.app.get("io");

    io.to(auction_id.toString()).emit("newBid", {
      auction_id,
      bid_amount,
      bidder_id: req.user.id,
      timestamp: new Date()
    });

    // ✅ 10. Response
    res.status(201).json({
      msg: "Bid placed successfully",
      bid
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};