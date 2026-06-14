const express = require("express");
const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/dashboard", reportController.getDashboardData);

module.exports = router;
