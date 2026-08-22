const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/employee", requireAuth, dashboardController.employeeDashboard);
router.get("/admin", requireAuth, requireRole("ADMIN"), dashboardController.adminDashboard);

module.exports = router;
