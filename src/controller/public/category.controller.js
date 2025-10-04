import * as categoryService from '../../services/public/category.service.js'


// Main categories (parentCategory = null)
export const getMainCategories = async (req, res) => {
  try {
    const categories = await categoryService.fetchMainCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Subcategories by id
export const getSubCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await categoryService.fetchSubCategories(id);
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopCategories = async (req, res) => {
  try {
    const categories = await categoryService.getTopCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};