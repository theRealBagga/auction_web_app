// controllers/auction.controller.js
const Auction = require("../models/auction.model");

exports.createAuction = async (req, res) => {
  const auction = await Auction.create({
    ...req.body,
    seller_id: req.user.id
  });

  res.json(auction);
};

exports.updateAuction = async (req, res) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction || auction.seller_id.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not allowed" });

  Object.assign(auction, req.body);
  await auction.save();

  res.json(auction);
};

exports.getAllAuctions = async (req, res) => {
  const auctions = await Auction.find();
  res.json(auctions);
};