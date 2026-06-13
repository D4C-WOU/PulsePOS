const employeeService = require("../services/employee.service");

exports.getEmployees = async (req, res) => {
  const employees = await employeeService.getEmployees();

  res.json(employees);
};
