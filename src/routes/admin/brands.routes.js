import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} from '../../controller/admin/brands.controller.js'



const router = express.Router()

router.post('/',protect, addBrand);         // Create brand
router.get('/', protect,getBrands);         // Get all brands
router.get('/:id',protect, getBrand);       // Get single brand
router.put('/:id',protect, updateBrand);    // Update brand
router.delete('/:id',protect, deleteBrand); // Delete brand

export default router;