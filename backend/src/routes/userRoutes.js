const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/me", requireAuth, userController.getMyProfile);
router.patch("/me", requireAuth, userController.updateMyProfile);

router.get("/", requireAuth, requireRole("ADMIN"), userController.listEmployees);
router.get("/:id", requireAuth, userController.getEmployeeById);
router.patch("/:id", requireAuth, requireRole("ADMIN"), userController.updateEmployee);
router.post("/:id/documents", requireAuth, requireRole("ADMIN"), userController.addDocument);

module.exports = router;
