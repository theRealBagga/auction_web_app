// seed.js — One-time script to populate dummy data
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/user.model");
const Auction = require("./models/auction.model");
const Bid = require("./models/bid.model");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clear existing data
  await User.deleteMany({});
  await Auction.deleteMany({});
  await Bid.deleteMany({});
  console.log("Cleared old data");

  // Create users
  const hashedPass = await bcrypt.hash("password123", 10);

  const seller = await User.create({
    name: "Abdulla",
    email: "abdulla@seller.com",
    password: hashedPass,
    role: "seller"
  });

  const buyer = await User.create({
    name: "Rahul",
    email: "rahul@buyer.com",
    password: hashedPass,
    role: "buyer"
  });

  console.log("Created users — seller: abdulla@seller.com / buyer: rahul@buyer.com (password: password123)");

  const now = new Date();
  const hr = 3600000;

  // Ongoing auctions (started in past, end in future)
  const ongoing = await Auction.insertMany([
    {
      seller_id: seller._id,
      item_name: "Vintage Rolex Submariner 1966",
      description: "Original 1966 Rolex Submariner in excellent condition. Comes with original box and papers. Recently serviced.",
      category: "Watches",
      start_time: new Date(now.getTime() - 2 * hr),
      end_time: new Date(now.getTime() + 6 * hr),
      current_highest_bid: 45000,
      highest_bidder_id: buyer._id,
      status: "active"
    },
    {
      seller_id: seller._id,
      item_name: "Fender Stratocaster 1972 Sunburst",
      description: "A beautiful 1972 Fender Stratocaster in 3-tone sunburst finish. All original parts, plays like a dream.",
      category: "Music",
      start_time: new Date(now.getTime() - 1 * hr),
      end_time: new Date(now.getTime() + 12 * hr),
      current_highest_bid: 28000,
      highest_bidder_id: buyer._id,
      status: "active"
    },
    {
      seller_id: seller._id,
      item_name: "Canon EOS R5 Mirrorless Camera",
      description: "Brand new Canon EOS R5 with RF 24-105mm f/4 lens kit. Sealed box, full warranty.",
      category: "Photography",
      start_time: new Date(now.getTime() - 3 * hr),
      end_time: new Date(now.getTime() + 4 * hr),
      current_highest_bid: 185000,
      highest_bidder_id: buyer._id,
      status: "active"
    },
    {
      seller_id: seller._id,
      item_name: "MacBook Pro M3 Max 16-inch",
      description: "Apple MacBook Pro with M3 Max chip, 36GB RAM, 1TB SSD. Space Black. Barely used, mint condition.",
      category: "Electronics",
      start_time: new Date(now.getTime() - 30 * 60000),
      end_time: new Date(now.getTime() + 8 * hr),
      current_highest_bid: 220000,
      highest_bidder_id: buyer._id,
      status: "active"
    }
  ]);
  console.log("Created 4 ongoing auctions");

  // Upcoming auctions (start in the future)
  const upcoming = await Auction.insertMany([
    {
      seller_id: seller._id,
      item_name: "Diamond Solitaire Ring 1.5ct",
      description: "GIA certified 1.5 carat round brilliant diamond set in 18K white gold. VS1 clarity, F color.",
      category: "Jewellery",
      start_time: new Date(now.getTime() + 5 * hr),
      end_time: new Date(now.getTime() + 24 * hr),
      current_highest_bid: 0,
      status: "active"
    },
    {
      seller_id: seller._id,
      item_name: "Signed First Edition — The Great Gatsby",
      description: "First edition, first printing of The Great Gatsby (1925) signed by F. Scott Fitzgerald. Excellent provenance.",
      category: "Books",
      start_time: new Date(now.getTime() + 12 * hr),
      end_time: new Date(now.getTime() + 48 * hr),
      current_highest_bid: 0,
      status: "active"
    },
    {
      seller_id: seller._id,
      item_name: "Nike Air Jordan 1 OG Chicago (1985)",
      description: "Original 1985 Air Jordan 1 'Chicago'. Size 10 US. Worn but well-preserved. Iconic piece of sneaker history.",
      category: "Fashion",
      start_time: new Date(now.getTime() + 3 * hr),
      end_time: new Date(now.getTime() + 18 * hr),
      current_highest_bid: 0,
      status: "active"
    }
  ]);
  console.log("Created 3 upcoming auctions");

  // Closed auctions (already ended)
  const closed = await Auction.insertMany([
    {
      seller_id: seller._id,
      item_name: "Antique Persian Rug 8x10",
      description: "Hand-knotted Persian Tabriz rug, circa 1920. Rich reds and blues with intricate medallion pattern.",
      category: "Antiques",
      start_time: new Date(now.getTime() - 48 * hr),
      end_time: new Date(now.getTime() - 2 * hr),
      current_highest_bid: 95000,
      highest_bidder_id: buyer._id,
      status: "closed"
    },
    {
      seller_id: seller._id,
      item_name: "Oil Painting — Mumbai Sunset",
      description: "Original oil on canvas depicting Mumbai skyline at sunset. 36x48 inches, framed. By local artist Priya Shah.",
      category: "Art",
      start_time: new Date(now.getTime() - 72 * hr),
      end_time: new Date(now.getTime() - 6 * hr),
      current_highest_bid: 32000,
      highest_bidder_id: buyer._id,
      status: "closed"
    },
    {
      seller_id: seller._id,
      item_name: "Herman Miller Eames Lounge Chair",
      description: "Authentic Herman Miller Eames Lounge Chair and Ottoman in walnut with black leather. 2018 production.",
      category: "Furniture",
      start_time: new Date(now.getTime() - 96 * hr),
      end_time: new Date(now.getTime() - 12 * hr),
      current_highest_bid: 150000,
      highest_bidder_id: buyer._id,
      status: "closed"
    }
  ]);
  console.log("Created 3 closed auctions");

  // Add some bids for the ongoing auctions
  const bidData = [];
  for (const auction of ongoing) {
    const amounts = [1000, 5000, 15000, auction.current_highest_bid];
    for (let i = 0; i < amounts.length; i++) {
      bidData.push({
        auction_id: auction._id,
        bidder_id: buyer._id,
        bid_amount: amounts[i],
        timestamp: new Date(now.getTime() - (amounts.length - i) * 30 * 60000)
      });
    }
  }
  await Bid.insertMany(bidData);
  console.log("Created bid history");

  console.log("\n✅ Seed complete!");
  console.log("Login credentials:");
  console.log("  Seller: abdulla@seller.com / password123");
  console.log("  Buyer:  rahul@buyer.com / password123");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
