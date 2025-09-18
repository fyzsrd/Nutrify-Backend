import Category from "../../models/admin/Category.js";
import cloudinary from "../../utils/cloudinary.js";
import { deleteCloudinaryImage } from "../../utils/cloudinaryHelper.js";

export const addCategory = async ({ data, filePath }) => {
  let result;
  try {
    // Duplicate check
    const existing = await Category.findOne({ name: data.name.trim() });
    if (existing) throw new Error("Category already exists");

    // Upload thumbnail to Cloudinary if provided
    if (filePath) {
      result = await cloudinary.uploader.upload(filePath, { folder: "categories" });
      data.thumbnail = result.secure_url;
      data.thumbnailPublicId = result.public_id;
    }

    // Save category to DB
    const category = new Category(data);
    return await category.save();

  } catch (error) {
    // Rollback cloudinary upload if DB fails
    if (result?.public_id) {
      await deleteCloudinaryImage(result.public_id);
    }
    throw error;
  }
};

// Update Category
export const updateCategory = async (categoryId, data, filePath) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

    // Normalize parentCategory
  if (data.parentCategory === 'null' || data.parentCategory === '') {
    data.parentCategory = null;
  }

  // Parent category validation
  if (data.parentCategory !== undefined && data.parentCategory !== null) {
    if (data.parentCategory.toString() === categoryId.toString()) {
      throw new Error("A category cannot be its own parent");
    }
    const parent = await Category.findById(data.parentCategory);
    if (!parent) throw new Error("Invalid parent category");
  }

 
  if (data.name) {
    const existing = await Category.findOne({
      name: data.name.trim(),
      _id: { $ne: categoryId },
    });
    if (existing) throw new Error("Category name already exists");
  }

  // If new file uploaded → delete old from Cloudinary + upload new
  if (filePath) {
    if (category.thumbnailPublicId) {
      await deleteCloudinaryImage(category.thumbnailPublicId);
    }
    const result = await cloudinary.uploader.upload(filePath, { folder: "categories" });
    data.thumbnail = result.secure_url;
    data.thumbnailPublicId = result.public_id;
  }

  const allowedFields = ["name", "parentCategory", "thumbnail", "thumbnailPublicId", "isActive", "isMain"];
  const safeData = {};
  for (let key of allowedFields) {
    if (data[key] !== undefined) safeData[key] = data[key];
  }

  return await Category.findByIdAndUpdate(categoryId, safeData, {
    new: true,
    runValidators: true,
  });
};

// get all categories
export const getAllCategories = async () => {
  try {
    // Fetch all categories without timestamps or version
    const categories = await Category.find({})
      .select("-createdAt -updatedAt -__v")
      .lean();

    // Map for quick lookup (each category gets a subCategories array)
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat, subCategories: [] };
    });

    // Build main → sub hierarchy
    const mainCategories = [];
    categories.forEach(cat => {
      if (cat.parentCategory) {
        // It's a sub-category, attach to its parent
        categoryMap[cat.parentCategory]?.subCategories.push(categoryMap[cat._id]);
      } else {
        // It's a main category
        mainCategories.push(categoryMap[cat._id]);
      }
    });

    // OPTIONAL: Remove empty subCategories arrays if you don't want them
    const cleanEmptyArrays = (cats) =>
      cats.map(cat => {
        const newCat = { ...cat };
        if (newCat.subCategories.length) {
          newCat.subCategories = cleanEmptyArrays(newCat.subCategories);
        } else {
          delete newCat.subCategories;
        }
        return newCat;
      });

    return cleanEmptyArrays(mainCategories); // use mainCategories directly if you want empty arrays kept
  } catch (error) {
    throw new Error(error.message || "Failed to fetch categories");
  }
};

// get Category by id  service

export const getCategory = async (categoryId) => {
  const category = await Category.findById(categoryId)
    .select('-__v -createdAt -updatedAt')
    .populate({
      path: 'parentCategory',
      select: '-__v -createdAt -updatedAt'
    }).lean()
  return category;
}

//delete category
export const deleteCategory= async (categoryId)=>{
  const category= await Category.findById(categoryId)
   if (!category) throw new Error("Category not found");

   const hasChildren= await Category.findOne({parentCategory:categoryId})
   if(hasChildren){
    throw new Error("Cannot delete category with subcategories. Please delete or reassign them first.");
   }

    // Delete image from cloudinary if exists
  if (category.thumbnailPublicId) {
    await deleteCloudinaryImage(category.thumbnailPublicId);
  }

   return await Category.findByIdAndDelete(categoryId)
  
}

export const getSubCategory=async ()=>{
  const allSubCategory=await Category.find({parentCategory:{$ne:null}})
  .select('name')
  return allSubCategory
}