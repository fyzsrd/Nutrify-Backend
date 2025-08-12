import Brands from "../../models/admin/Brands.js";


/**
 * Create a new brand
 */
export const createBrand = async (data) => {
  const brand = new Brands(data);
  return await brand.save();
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
export const updateBrand = async (id, updateData) => {
  return await Brands.findByIdAndUpdate(id, updateData, { new: true })
    .select('-__v')
    .lean();
};

/**
 * Delete brand
 */
export const deleteBrand = async (id) => {
  return await Brands.findByIdAndDelete(id);
};