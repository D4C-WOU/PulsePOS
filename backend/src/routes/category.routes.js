const express = require("express");
const { body } = require("express-validator");
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, categoryController.getCategories);

router.post(
  "/",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("color").trim().matches(/^#[0-9A-Fa-f]{6}$/).withMessage("Must be a valid hex color code"),
  ],
  categoryController.createCategory
);

router.put(
  "/:id",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("color").trim().matches(/^#[0-9A-Fa-f]{6}$/).withMessage("Must be a valid hex color code"),
  ],
  categoryController.updateCategory
);

router.delete("/:id", requireAdmin, categoryController.deleteCategory);

module.exports = router;
