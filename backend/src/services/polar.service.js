const crypto = require("crypto");

const POLAR_API = "https://sandbox-api.polar.sh/api";

const createCheckout = async (order) => {
  const priceId = process.env.POLAR_PRODUCT_PRICE_ID;
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  // Polar checkouts create endpoint
  // We pass price_id, success_url, and metadata
  // Since we might need USD cents or INR paise, we pass standard total.
  // Note: Polar Sandbox uses standard products.
  const response = await fetch(`${POLAR_API}/v1/checkouts/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_price_id: priceId,
      success_url: `${frontendUrl}/pos?payment_status=success&order_id=${order.id}`,
      // Polar sandbox requires custom amount if price is flexible
      amount: Math.round(parseFloat(order.total) * 100), // in cents/paise
      currency: "usd", // default sandbox currency
      metadata: {
        order_id: String(order.id),
        order_number: order.order_number,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Polar API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return { checkout_url: data.url, polar_checkout_id: data.id };
};

const verifyWebhookSignature = (rawBody, signature, secret) => {
  if (!signature || !secret) return false;
  
  try {
    const computed = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
      
    // Polar signature might be prefixed, e.g. "sha256=..." or standard hex
    const cleanSignature = signature.includes("sha256=") 
      ? signature.split("sha256=")[1] 
      : signature;

    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(cleanSignature, "hex")
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

module.exports = {
  createCheckout,
  verifyWebhookSignature,
};
