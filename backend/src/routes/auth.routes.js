const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

router.get("/me", authMiddleware, authController.me);

module.exports = router;
