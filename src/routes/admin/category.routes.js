import express from 'express';
import {addCategory,getCategoriesController,getCategory,updateCategory,deleteCategory} from '../../controller/admin/category.controller.js'
import {protect} from '../../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/',protect, addCategory);  // POST /api/admin/category
router.get('/',protect,getCategoriesController)
router.get('/:id',protect,getCategory ); 
router.put('/:id',protect,updateCategory)
router.delete('/:id',protect,deleteCategory)
export default router;