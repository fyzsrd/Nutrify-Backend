import express from 'express';
import {addCategory,getCategoriesController,getCategory,updateCategory,deleteCategory} from '../../controller/admin/category.controller.js'
import {protect} from '../../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/', addCategory);  // POST /api/admin/category
router.get('/',getCategoriesController)
router.get('/:id',getCategory ); 
router.put('/:id',updateCategory)
router.delete('/:id',deleteCategory)
export default router;