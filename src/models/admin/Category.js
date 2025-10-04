import mongoose from "mongoose";

const { Schema } = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    thumbnailPublicId: { type: String },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isMain: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true
})


const Category = mongoose.model("Category", categorySchema);

export default Category;