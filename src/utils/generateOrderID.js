import Order from "../models/order.model.js";

/**
 * Generate a unique, sequential order ID
 * Format: ORD-YYYYMMDD-XXXX
 * e.g. ORD-20251017-0001
 */
export const generateOrderID = async () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dateString = `${yyyy}${mm}${dd}`;

  // Count orders created today to generate sequence
  const todayStart = new Date(yyyy, date.getMonth(), date.getDate());
  const todayEnd = new Date(yyyy, date.getMonth(), date.getDate() + 1);

  const count = await Order.countDocuments({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });

  const sequence = String(count + 1).padStart(4, "0"); // 0001, 0002...

  return `ORD-${dateString}-${sequence}`;
};
