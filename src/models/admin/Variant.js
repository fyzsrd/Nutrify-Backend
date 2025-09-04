import mongoose from "mongoose";
const { Schema } = mongoose;
import Product from "./Product.js";
import { setNewDefaultVariant } from "../../helpers/variantHelpers.js";

const variantSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    weightType: {
      type: String,
      enum: ["kg", "lbs", "g", "oz"],
      required: true
    },
    flavor: {
      type: String,
      trim: true
    },
    mrp: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      default: 0
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    images: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

// Before save: ensure only one default per product
variantSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await mongoose.model("Variant").updateMany(
      {
        productId: this.productId,
        _id: { $ne: this._id }
      },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// After save: update product info + activate if variant exists
variantSchema.post("save", async function (doc) {
  try {
    const variantCount = await mongoose.model("Variant").countDocuments({ productId: doc.productId });

    await Product.findByIdAndUpdate(doc.productId, {
      isActive: variantCount > 0,
      ...(doc.isDefault
        ? {
            defaultVariantId: doc._id,
            defaultPrice: doc.price,
            defaultMrp: doc.mrp,
            defaultThumbnail: doc.images?.[0] || null,
            thumbnail: doc.images
          }
        : {})
    });
  } catch (err) {
    console.error("Error updating product after variant save:", err);
  }
});

// After deletion: deactivate product if no variants remain + set new default if needed
variantSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  try {
    const variantCount = await mongoose.model("Variant").countDocuments({ productId: doc.productId });

    await Product.findByIdAndUpdate(doc.productId, {
      isActive: variantCount > 0
    });

    if (doc.isDefault) {
      await setNewDefaultVariant(doc.productId, doc._id);
    }
  } catch (err) {
    console.error("Error updating product after variant delete:", err);
  }
});

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
