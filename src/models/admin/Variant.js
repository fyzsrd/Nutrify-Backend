import mongoose from "mongoose";
const { Schema } = mongoose;
import Product from "./Product.js";
import { setNewDefaultVariant } from '../../helpers/variantHelpers.js'

const variantSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  weight: {
    type: Number, // Or Number if always in grams
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
}, {
  timestamps: true
});


variantSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await mongoose.model("Variant").updateMany(
      {
        productId: this.productId,
        _id: { $ne: this._id }
      },
      { $set: { isDefault: false } } // 👈 must include this
    );
  }
  next();
});

// After saving: update product thumbnail if default
variantSchema.post("save", async function (doc) {
  if (doc.isDefault && doc.images.length > 0) {
    try {
      await Product.findByIdAndUpdate(doc.productId, {
        defaultVariantId: doc._id,
        defaultPrice: doc.price,
        defaultMrp: doc.mrp,
        defaultThumbnail: doc.images?.[0] || null,

        thumbnail: doc.images
      });
    } catch (err) {
      console.error("Error updating product thumbnail:", err);
    }
  }
});

// After deletion: set cheapest variant as new default if needed
variantSchema.post("findOneAndDelete", async function (doc) {
  if (doc?.isDefault) {
    await setNewDefaultVariant(doc.productId, doc._id);
  }
});

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
