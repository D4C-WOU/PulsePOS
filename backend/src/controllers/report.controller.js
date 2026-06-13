const reportService = require("../services/report.service");

exports.salesReport = async (req, res) => {
  const report = await reportService.salesReport();

  res.json(report);
};
