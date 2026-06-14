const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/", userController.getUsers);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),
    body("role").isIn(["admin", "employee"]).withMessage("Invalid user role"),
  ],
  userController.createUser
);

router.put(
  "/:id",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
    body("role").isIn(["admin", "employee"]).withMessage("Invalid user role"),
  ],
  userController.updateUser
);

router.put(
  "/:id/password",
  [
    body("new_password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),
  ],
  userController.changePassword
);

router.put("/:id/archive", userController.toggleArchive);

router.delete("/:id", userController.deleteUser);

module.exports = router;
