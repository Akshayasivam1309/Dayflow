const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/", requireAuth, leaveController.applyLeave);
router.get("/me", requireAuth, leaveController.getMyLeaves);
router.get("/", requireAuth, requireRole("ADMIN"), leaveController.getAllLeaves);
router.patch("/:id/review", requireAuth, requireRole("ADMIN"), leaveController.reviewLeave);

module.exports = router;
