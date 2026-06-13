const router = require("express").Router();

const { salesReport } = require("../controllers/report.controller");

router.get("/sales", salesReport);

module.exports = router;
