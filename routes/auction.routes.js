const router = require("express").Router();
const controller = require("../controllers/auction.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

console.log(controller)
router.post("/", protect, authorize("seller"), controller.createAuction);
router.put("/:id", protect, authorize("seller"), controller.updateAuction);
router.get("/", controller.getAllAuctions);

module.exports = router;