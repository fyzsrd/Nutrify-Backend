import Product from "../../models/admin/Product.js";
import Variant from "../../models/admin/Variant.js";



export const getProductsByCategory = async (categoryId) => {

  const products = await Product.find({ category: categoryId })
  .select('-__v -craetedAt -updatedAt')
  
  
  return products
};