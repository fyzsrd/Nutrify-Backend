import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name must be under 150 characters"]
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    isTested: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      maxlength: [500, "Description should be under 500 characters"],
    },
    howtoUse: {
      type: String,
      maxlength: [300, "How to use should be under 300 characters"],
    },
    ingredients: {
      type: String,
      maxlength: [200, "Ingredients should be under 200 characters"],
    },
    countryInfo: { type: String, trim: true },
    manufactureInfo: { type: String, trim: true },
    fssaiNumber: {
      type: Number,
      validate: {
        validator: v => /^\d{14}$/.test(v), // Example: 14-digit FSSAI number
        message: "Invalid FSSAI number format"
      }
    },
    importerInfo: { type: String, trim: true },
    images: [String], // Multiple image URLs
    thumbnail: [String], // From default variant
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual populate
ProductSchema.virtual('variants', {
  ref: 'Variant',               // Model name
  localField: '_id',             // Product._id
  foreignField: 'productId'      // Variant.productId
});

// Enable virtual fields in JSON
ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product