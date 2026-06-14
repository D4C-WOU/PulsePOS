const express = require("express");
const sessionController = require("../controllers/session.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

// Historical list (Admin only)
router.get("/", requireAdmin, sessionController.getSessions);

// Active check, open and close (Employee+)
router.get("/active", requireEmployee, sessionController.getActiveSession);
router.post("/open", requireEmployee, sessionController.openSession);
router.post("/close/:id", requireEmployee, sessionController.closeSession);

module.exports = router;
