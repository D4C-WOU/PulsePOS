const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
