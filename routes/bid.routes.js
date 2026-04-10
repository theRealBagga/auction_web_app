const router = require("express").Router();
const controller = require("../controllers/bid.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.post("/", protect, authorize("buyer"), controller.placeBid);

module.exports = router;