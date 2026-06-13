const receiptService = require("../services/receipt.service");

exports.getReceipt = async (req, res) => {
  const receipt = await receiptService.getReceipt(req.params.id);

  res.json(receipt);
};
