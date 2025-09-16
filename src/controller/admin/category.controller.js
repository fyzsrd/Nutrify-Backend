import * as categoryService from '../../services/admin/category.service.js'
import fs from 'fs'

//add categroy FIXED_DONT CHANGED WORKING
export const addCategory = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { name, parentCategory, isActive = 'true', isMain = 'false' } = req.body || {};

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Convert strings to proper types
    const isActiveBool = isActive === 'true';
    const isMainBool = isMain === 'true';
    const parentCatId = parentCategory === 'null' ? null : parentCategory;

    // Call service
    const category = await categoryService.addCategory({
      data: {
        name: name.trim(),
        parentCategory: parentCatId,
        isActive: isActiveBool,
        isMain: isMainBool
      },
      filePath: req.file?.path
    });

    // Delete temp file after upload
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(201).json({ success: true, message: 'Category added', category });

  } catch (error) {
    // Handle duplicate
    if (error.message === "Category already exists") {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(400).json({ success: false, message: error.message });
  }
};

//update Category
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) return res.status(400).json({ message: "Category ID is required" });

    const updatedCategory = await categoryService.updateCategory(
      categoryId,
      req.body,
      req.file?.path || null // pass filePath if uploaded
    );

    if (req.file) fs.unlinkSync(req.file.path); // remove temp file

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCategoriesController = async (req, res) => {

  try {

   
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const getCategory =async (req ,res)=>{
  try{

    const categoryId=req.params.id;

    if(!categoryId) return res.status(404).json({ success: false, message: 'catgeory Id not found' });
    const category =await categoryService.getCategory(categoryId);
    return res.status(200).json({
      success:true,
      data:category
    })
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) return res.status(400).json({ success: false, message: "Invalid category" });

    await categoryService.deleteCategory(categoryId);

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};