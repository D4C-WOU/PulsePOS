const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  };
  return date.toLocaleString('en-IN', options);
};

const sendReceipt = async (order, email) => {
  const formattedDate = formatDate(order.created_at || new Date());
  const tableName = order.table_number || (order.table && order.table.table_number) || "Takeaway";

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; background: #132A1E; color: #FEFAE0; padding: 20px; border-radius: 8px;">
    <h2 style="color: #95D5B2; text-align: center; margin-bottom: 5px;">☕ Odoo Cafe POS</h2>
    <h3 style="text-align: center; margin-top: 0; color: #F0D9A0;">Receipt</h3>
    <p>Order: <strong>${order.order_number}</strong></p>
    <p>Date: ${formattedDate}</p>
    <p>Table: ${tableName}</p>
    <table style="width:100%; border-collapse: collapse; margin: 16px 0; color: #FEFAE0;">
      <thead>
        <tr style="border-bottom: 1px solid #2D4A3E;">
          <th style="text-align:left; padding-bottom: 5px;">Item</th>
          <th style="padding-bottom: 5px;">Qty</th>
          <th style="text-align:right; padding-bottom: 5px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr style="border-bottom: 1px dashed rgba(45, 74, 62, 0.5);">
            <td style="padding: 8px 0;">
              ${item.product_name}
              ${parseFloat(item.item_discount) > 0 ? `<br/><span style="font-size: 11px; color: #52B788;">Discount: -₹${parseFloat(item.item_discount).toFixed(2)}</span>` : ''}
            </td>
            <td style="text-align:center; padding: 8px 0;">${item.quantity}</td>
            <td style="text-align:right; padding: 8px 0;">₹${parseFloat(item.line_total).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <hr style="border: 0; border-top: 1px solid #2D4A3E; margin: 10px 0;" />
    <div style="font-size: 14px; line-height: 1.6;">
      <p style="margin: 4px 0; display: flex; justify-content: space-between;">
        <span>Subtotal:</span>
        <span>₹${parseFloat(order.subtotal).toFixed(2)}</span>
      </p>
      <p style="margin: 4px 0; display: flex; justify-content: space-between;">
        <span>Tax:</span>
        <span>₹${parseFloat(order.tax_amount).toFixed(2)}</span>
      </p>
      <p style="margin: 4px 0; display: flex; justify-content: space-between;">
        <span>Discount:</span>
        <span>−₹${parseFloat(order.discount_amount).toFixed(2)}</span>
      </p>
      <p style="font-size:18px; font-weight:bold; color:#95D5B2; margin: 10px 0 0 0; display: flex; justify-content: space-between;">
        <span>Total:</span>
        <span>₹${parseFloat(order.total).toFixed(2)}</span>
      </p>
    </div>
    <p style="text-align:center; color:#6B8F71; margin-top:30px; font-size: 13px;">Thank you for visiting Odoo Cafe! ☕</p>
  </div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Odoo Cafe" <cafe@odoocafe.com>',
    to: email,
    subject: `Receipt — Order ${order.order_number} — Odoo Cafe`,
    html,
  });
};

module.exports = {
  sendReceipt,
};
