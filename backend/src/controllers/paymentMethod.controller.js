const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getPaymentMethods = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM payment_methods");
    
    const methods = rows.map(r => ({
      id: r.id,
      type: r.type,
      is_enabled: !!r.is_enabled,
      upi_id: r.upi_id,
    }));

    res.status(200).json({
      success: true,
      data: methods,
    });
  } catch (error) {
    next(error);
  }
};

const updatePaymentMethod = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { is_enabled, upi_id } = req.body;

    const [exists] = await pool.query("SELECT * FROM payment_methods WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    const method = exists[0];

    // Business validation: if type is 'upi' and it's enabled, upi_id is mandatory
    if (method.type === "upi" && is_enabled && (!upi_id || upi_id.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "UPI ID is required when enabling UPI payments",
      });
    }

    await pool.query(
      "UPDATE payment_methods SET is_enabled = ?, upi_id = ? WHERE id = ?",
      [is_enabled, method.type === "upi" ? upi_id : null, id]
    );

    const [updatedRows] = await pool.query("SELECT * FROM payment_methods WHERE id = ?", [id]);
    const updated = updatedRows[0];

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        type: updated.type,
        is_enabled: !!updated.is_enabled,
        upi_id: updated.upi_id,
      },
      message: "Payment method updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentMethods,
  updatePaymentMethod,
};
