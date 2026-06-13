const router = require("express").Router();

const { getReceipt } = require("../controllers/receipt.controller");

router.get("/:id", getReceipt);

module.exports = router;
