import * as categoryService from '../../services/admin/category.service.js'


export const addCategory = async (req, res) => {
  try {
    const { name, parentCategory, thumbnail, isActive = true, isMain=false} = req.body || {};

    // Validate only the truly required fields
    if (!name || !thumbnail) {
      return res.status(400).json({ message: 'Name and thumbnail are required' });
    }

    // Create category
    const category = await categoryService.addCategory({
      data: {
        name,
        parentCategory,
        thumbnail,
        isActive,
        isMain
      }
    });

    res.status(201).json({ message: 'Category added', category });

  } catch (error) {
    if (error.message === "Category already exists") {
      return res.status(409).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const { name, parentCategory, thumbnail, isActive } = req.body || {};


    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const updatedCategory = await categoryService.updateCategory(categoryId, {
      name,
      parentCategory,
      thumbnail,
      isActive
  })

   res.json({ success: true, data: updatedCategory });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

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
      message:category
    })
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const deleteCategory=async (req,res)=>{
  try{
    const categoryId=req.params.id ;
 if (!categoryId) return res.status(404).json({ success: false, message: 'Invalid catgeory' });
    const deleted =await categoryService.deleteCategory(categoryId)
    if (!deleted) return res.status(404).json({ success: false, message: 'category not found' });
        res.json({ success: true, message: 'Category deleted successfully' });

  }catch(error){
    res.status(500).res.json({
      success:false,
      message:error.message
    })
  }
}