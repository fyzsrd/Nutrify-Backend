import Category from "../../models/admin/Category.js";

//public category service
// Fetch only main categories

export const fetchMainCategories = async () => {
  const categories =await Category.find({ parentCategory: null, isActive: true })
  .select('-__v -createdAt -updatedAt -parentCategory')
  return categories
};

// Fetch subcategories 
export const fetchSubCategories = async (parentId) => {
  return await Category.find({ parentCategory: parentId, isActive: true }).select('-__v -createdAt -updatedAt ');
};

export const getTopCategories = async () => {
  const categories =await Category.find({ parentCategory: {$ne:null}, isActive: true })
  .select('-__v -createdAt -updatedAt -parentCategory')
  return categories
};