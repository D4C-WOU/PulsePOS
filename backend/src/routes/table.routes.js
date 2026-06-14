const express = require("express");
const { body } = require("express-validator");
const tableController = require("../controllers/table.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, tableController.getTables);

router.post(
  "/",
  [
    requireAdmin,
    body("floor_id").isInt().withMessage("Floor ID must be an integer"),
    body("table_number").trim().notEmpty().withMessage("Table number is required"),
    body("seats").isInt({ min: 1 }).withMessage("Seats must be at least 1"),
  ],
  tableController.createTable
);

router.put(
  "/:id",
  [
    requireAdmin,
    body("table_number").trim().notEmpty().withMessage("Table number is required"),
    body("seats").isInt({ min: 1 }).withMessage("Seats must be at least 1"),
  ],
  tableController.updateTable
);

router.delete("/:id", requireAdmin, tableController.deleteTable);

module.exports = router;
