const tableService = require("../services/table.service");

const getTables = async (req, res) => {
  try {
    const tables = await tableService.getTables();

    res.json(tables);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const updated = await tableService.updateTableStatus(id, status);

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTables,
  updateTableStatus,
};
