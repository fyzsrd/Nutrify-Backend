import express from 'express';
import {addCategory,getCategoriesController,getCategory,updateCategory,deleteCategory,getSubCategory} from '../../controller/admin/category.controller.js'
import {protect} from '../../middlewares/authMiddleware.js'
import upload from '../../middlewares/multer.js';
const router = express.Router();



router.post('/',upload.single("thumbnail"), addCategory);  // POST /api/admin/category
router.get('/',getCategoriesController)
router.get('/panel',getSubCategory)




router.get('/:id',getCategory ); 
router.put('/:id',upload.single("thumbnail"),updateCategory)
router.delete('/:id',deleteCategory)
export default router;