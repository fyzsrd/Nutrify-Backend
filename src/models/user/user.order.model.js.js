import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderID: {
      type: String,
      required: true,
      unique: true, // e.g. ORD-20251017-0001
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "stripe", "paypal"],
      default: "cod",
    },
    trackingId: {
      type: String,
      default: null,
    },
    courier: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for performance
orderSchema.index({userId:1,orderID:1});

orderSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;