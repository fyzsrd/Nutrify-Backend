import Product from '../../models/admin/Product.js';
import Variant from '../../models/admin/Variant.js'
import cloudinary from '../../utils/cloudinary.js';


/**
 * createProduct:
 * - uploads files to Cloudinary
 * - stores images as URLs (strings) and imagePublicIds separately
 * - rollback on failure
 */
export const createProduct = async (data, files = []) => {
  // duplicate check
  const existing = await Product.findOne({ name: data.name });
  if (existing) {
    throw new Error("Product already exists");
  }

  const uploaded = []; // { url, publicId }
  try {
    // upload each file to cloudinary
    if (files.length) {
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          use_filename: true,
          quality: "auto",
          fetch_format: "auto",
        });
        uploaded.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    // normalize images & publicIds into arrays of strings (matches your schema)
    data.images = uploaded.map(u => u.url);            // array of URLs (strings)
    data.imagePublicIds = uploaded.map(u => u.publicId); // parallel array of public ids

    // if thumbnail not provided, use first uploaded image URL
    if (!data.thumbnail && data.images.length) {
      data.thumbnail = data.images[0];
      data.defaultThumbnail = data.images[0];
    }

    // fssaiNumber: convert empty -> undefined to avoid schema number parse problems
    if (data.fssaiNumber === "" || data.fssaiNumber === null || data.fssaiNumber === undefined) {
      delete data.fssaiNumber;
    }

    const product = new Product(data);
    return await product.save();
  } catch (err) {
    // rollback cloudinary uploads
    if (uploaded.length) {
      for (const u of uploaded) {
        try { await cloudinary.uploader.destroy(u.publicId); } catch (e) { console.warn("rollback destroy failed", e); }
      }
    }
    throw err;
  }
};

export const getAllProducts = async () => {
    const products = await Product.find({}).select('-__v -createdAt -updatedAt')
    if (!products) throw new Error("no product available")
    return products;
}


export const getProduct = async (productId) => {
    const product = await Product.findById(productId).select('-__v -createdAt -updatedAt')
    if (!product) throw new Error("no product available")
    return product;
}

export const updateProduct = async (productId, updateData, options = {}) => {
    const existing = await Product.findById(productId);
    if (!existing) throw new Error("Couldn't find product");

    // Handle images only if provided
    if (updateData.images !== undefined) {
        const newImages = Array.isArray(updateData.images)
            ? updateData.images
            : [updateData.images];

        if (options.replaceImages) {
            await Product.updateOne(
                { _id: productId },
                { $set: { images: newImages } }
            );
        } else {
            await Product.updateOne(
                { _id: productId },
                { $addToSet: { images: { $each: newImages } } }
            );
        }

        delete updateData.images; // Prevent overwriting with $set later
    }

    // Update other fields
    const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updated;
};


export const deleteProduct = async (productId) => {
    const existing = await Product.findById(productId);
    if (!existing) throw new Error("Product doesn't exist");

    const deleted = await Product.findByIdAndDelete(productId);
    return deleted;
};




export const getPanelProducts = async () => {
    const products = await Product.find()
        .populate("brand", "name")
        .populate("category", "name")
        .populate("variants", "_id");

    // sanitize data
    return products.map(p => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        brand: p.brand,
        variants: p.variants?.length || 0,
        isPromoted: p.isPromoted,
        isActive: p.isActive,
        images: p.images || [],
        defaultPrice: p.defaultPrice,
    }));

}

export const getPanelProductDetails = async (productId) => {
    const product = await Product.findById(productId)
        .populate("variants")
        .lean();


    delete product.createdAt
    delete product.updatedAt
    delete product.__v

    if (product.variants) {
        product.variants = product.variants.map((v) => {
            const { createdAt, updatedAt, __v, ...rest } = v
            return rest
        })
    }
    return product
}