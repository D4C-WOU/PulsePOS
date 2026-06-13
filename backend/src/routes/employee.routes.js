const router = require("express").Router();

const { getEmployees } = require("../controllers/employee.controller");

router.get("/", getEmployees);

module.exports = router;
