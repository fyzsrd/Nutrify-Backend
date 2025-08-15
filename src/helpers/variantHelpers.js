import Product from "../models/admin/Product.js"

import mongoose from 'mongoose';


export const setNewDefaultVariant = async (productId, excludeVariantId = null) => {
    const Variant = mongoose.model("Variant");

    // Find cheapest variant, excluding one we deleted if applicable
    const cheapestVariant = await Variant.findOne({
        productId,
        ...(excludeVariantId ? { _id: { $ne: excludeVariantId } } : {})
    })
    .sort({ price: 1 }) // ascending order
    .limit(1);

    if (cheapestVariant) {
        // ✅ Update directly without triggering save hooks
        await Variant.updateOne(
            { _id: cheapestVariant._id },
            { $set: { isDefault: true } }
        );

        // Update product thumbnail
        await Product.findByIdAndUpdate(productId, {
            thumbnail: cheapestVariant.images
        });
    } else {
        // No variants left → clear thumbnail
        await Product.findByIdAndUpdate(productId, { thumbnail: [] });
        console.warn(`[Warning] Product ${productId} has no variants left — no default set.`);
    }

    // Safety check — ensure only one default
    const defaultCount = await Variant.countDocuments({ productId, isDefault: true });
    if (defaultCount === 0) {
        console.warn(`[Warning] Product ${productId} has no default variant!`);
    } else if (defaultCount > 1) {
        console.warn(`[Warning] Product ${productId} has multiple default variants (${defaultCount}).`);
    }
};