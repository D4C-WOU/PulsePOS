const express = require("express");
const { body } = require("express-validator");
const floorController = require("../controllers/floor.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, floorController.getFloors);

router.post(
  "/",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Floor name is required"),
  ],
  floorController.createFloor
);

router.put(
  "/:id",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Floor name is required"),
  ],
  floorController.updateFloor
);

router.delete("/:id", requireAdmin, floorController.deleteFloor);

module.exports = router;
