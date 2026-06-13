const router = require("express").Router();

const {
  getCategories,
  createCategory,
} = require("../controllers/category.controller");

router.get("/", getCategories);

router.post("/", createCategory);

module.exports = router;
