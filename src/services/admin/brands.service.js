import Brands from "../../models/admin/Brands.js";
import Products from '../../models/admin/Product.js'
import cloudinary from "../../utils/cloudinary.js";

/**
 * Create a new brand
 */
export const createBrand = async (data,filePath) => {
  let result;
  try{
    if(filePath){
      result =await cloudinary.uploader.upload(filePath,{folder:"brands"});
      data.logo=result.secure_url,
      data.logoPublicId=result.public_id;
    }

     const brand = new Brands(data);
      return await brand.save();

  }catch(error){
    if(result?.public_id){
      await cloudinary.uploader.destroy(result.public_id)
    }
    throw error

  }
 
 
};

/**
 * Get all brands (without __v)
 */
export const getAllBrands = async () => {
  return await Brands.find().select('-__v -createdAt -updatedAt').lean();
};

/**
 * Get brand by ID
 */
export const getBrandById = async (id) => {
  return await Brands.findById(id).select('-__v -createdAt -updatedAt').lean();
};

/**
 * Update brand
 */
// Update brand safely
export const updateBrand = async (id, updateData, filePath) => {
  const brand = await Brands.findById(id);
  if (!brand) throw new Error("Brand not found");

  let result;
  try {
    if (filePath) {
      // upload new one first
      result = await cloudinary.uploader.upload(filePath, { folder: "brands" });
      updateData.logo = result.secure_url;
      updateData.logoPublicId = result.public_id;
    }

    const updated = await Brands.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .select("-__v")
      .lean();

    // only after DB success → delete old logo
    if (filePath && brand.logoPublicId) {
      await cloudinary.uploader.destroy(brand.logoPublicId);
    }

    return updated;
  } catch (err) {
    // rollback newly uploaded image
    if (result?.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    throw err;
  }
};

/**
 * Delete brand
 */
export const deleteBrand = async (id) => {

  const brand = await Brands.findById(id)
  if (!brand) {
    throw new Error("Brand not found");
  }

    // Prevent deletion if products exist
  const productCount=await Products.countDocuments({brand:id});
  if(productCount > 0){
    throw new Error("Cannot delete brand. Products are associated with this brand.");
  }

  if(brand.logoPublicId){
    await cloudinary.uploader.destroy(brand.logoPublicId)
  }

  return await Brands.findByIdAndDelete(id);
};