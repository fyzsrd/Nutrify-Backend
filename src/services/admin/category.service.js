import Category from "../../models/admin/Category.js";

export const addCategory = async ({ data }) => {

  const existing = await Category.findOne({ name: data.name.trim() });
  if (existing) throw new Error('Category already exists');

  // const isMainCategory = !data.parentCategory;
  console.log(data)
  const category = new Category({
    name: data.name.trim(),
    parentCategory: data.parentCategory || null,
    thumbnail: data.thumbnail,
    isActive: data.isActive,
    isMain: data.isMain || false

  });
  await category.save();

  return category
}


//Update Category
export const updateCategory = async (categoryId, data) => {
 
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  // 2. Validate parentCategory
  if (data.parentCategory !== undefined && data.parentCategory !== null) {
    if (data.parentCategory.toString() === categoryId.toString()) {
      throw new Error("A category cannot be its own parent");
    }
    const existingParent = await Category.findById(data.parentCategory);
    if (!existingParent) {
      throw new Error("Invalid parent category");
    }
  }

  
  if (data.name) {
    const existing = await Category.findOne({
      name: data.name.trim(),
      _id: { $ne: categoryId }
    });
    if (existing) {
      throw new Error("Category name already exists");
    }
  }

 
  const allowedFields = ["name", "parentCategory", "thumbnail", "isActive", "isMain"];
  const safeData = {};
  for (let key of allowedFields) {
    if (data[key] !== undefined) safeData[key] = data[key];
  }

  
  const updated = await Category.findByIdAndUpdate(
    categoryId,
    safeData,
    { new: true, runValidators: true }
  );

  return updated;
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
   return await Category.findByIdAndDelete(categoryId)
  
}

