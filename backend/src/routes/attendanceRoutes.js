const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/check-in", requireAuth, attendanceController.checkIn);
router.post("/check-out", requireAuth, attendanceController.checkOut);
router.get("/me", requireAuth, attendanceController.getMyAttendance);
router.get("/", requireAuth, requireRole("ADMIN"), attendanceController.getAllAttendance);
router.patch("/:id", requireAuth, requireRole("ADMIN"), attendanceController.updateAttendanceStatus);

module.exports = router;
