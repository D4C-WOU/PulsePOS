const router = require("express").Router();

const {
  getTables,
  updateTableStatus,
} = require("../controllers/table.controller");

router.get("/", getTables);

router.patch("/:id", updateTableStatus);

module.exports = router;
