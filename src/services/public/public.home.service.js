import Variant from '../../models/admin/Variant.js'
import Category from '../../models/admin/Category.js'
import Product from '../../models/admin/Product.js';




export const getHomeData = async () => {
  // Fetch banners, categories, products, etc.

 

    const products = await getHomeProducts();
    // const productData = await Product.find().select('-__v -createdAt -updatedAt')
    
// productData,
     return {
    
    products,
    
  };

};



export const getHomeProducts = async () => {
  const variants = await Variant.find({ isDefault: true })
    .populate("productId", "name description thumbnail")
    .limit(10)
    .lean();

  return variants.map(v => ({
    _id: v.productId._id,
    name: v.productId.name,
    price: v.price,
    mrp: v.mrp,
    flavor: v.flavor,
    weight: v.weight,
    weightType: v.weightType,
    defaultThumbnail: v.images,
    sku: v.sku
  }));
};


export const getProductDetail = async (productId) => {
  const productDetails = await Product.findById(productId)
    .select("-__v -createdAt -updatedAt") // clean product fields
    .populate({
      path: "variants",   // 👈 matches virtual name
      select: "-__v -createdAt -updatedAt"
    })
    .lean(); // optional, returns plain JS object

  if (!productDetails) {
    throw new Error("Product not found");
  }

  return productDetails;
};

export const getSubCategories = async () => {
  return await Category.find({
    parentCategory: { $ne: null }, // exclude categories with null parent
    isActive: true, // only active ones
  }).populate("parentCategory", "name"); // optional populate to show parent name
};
