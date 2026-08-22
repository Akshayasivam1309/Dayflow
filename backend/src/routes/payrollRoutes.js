const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/me", requireAuth, payrollController.getMyPayroll);
router.get("/", requireAuth, requireRole("ADMIN"), payrollController.getAllPayroll);
router.get("/:userId", requireAuth, requireRole("ADMIN"), payrollController.getPayrollByUser);
router.patch("/:userId", requireAuth, requireRole("ADMIN"), payrollController.updatePayroll);

module.exports = router;
