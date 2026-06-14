const express = require("express");
const kdsController = require("../controllers/kds.controller");

const router = express.Router();

router.get("/tickets", kdsController.getTickets);
router.put("/tickets/:id/stage", kdsController.updateTicketStage);
router.put("/items/:id/complete", kdsController.updateItemCompletion);

module.exports = router;
