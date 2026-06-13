const customerService = require("../services/customer.service");

exports.getCustomers = async (req, res) => {
  const customers = await customerService.getCustomers();

  res.json(customers);
};

exports.createCustomer = async (req, res) => {
  const { name, phone, email } = req.body;

  const result = await customerService.createCustomer(name, phone, email);

  res.status(201).json(result);
};
