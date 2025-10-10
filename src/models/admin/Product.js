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
      maxlength: [1000, "Description should be under 1000 characters"],
    },
    howtoUse: {
      type: String,
      maxlength: [1000, "How to use should be under 1000 characters"],
    },
    ingredients: {
      type: String,
      maxlength: [500, "Ingredients should be under 500 characters"],
    },
    countryInfo: { type: String, trim: true },
    manufactureInfo: { type: String, trim: true },
    fssaiNumber: {
      type: String,
      validate: {
        validator: v => !v || /^\d{14}$/.test(v), // allow empty or 14-digit
        message: "Invalid FSSAI number format"
      }
    },
    importerInfo: { type: String, trim: true },
    images: [String], // image URLs
    imagePublicIds: [String], // cloudinary public IDs// Multiple image URLs
    thumbnail: [String], // From default variant
    isActive: {
      type: Boolean,
      default: false,
    },
    defaultVariantId: { type: Schema.Types.ObjectId, ref: "Variant" },
    defaultPrice: { type: Number },
    defaultMrp: { type: Number },
    defaultThumbnail: { type: String },

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