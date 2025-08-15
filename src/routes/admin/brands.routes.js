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

router.post('/', addBrand);         // Create brand
router.get('/', getBrands);         // Get all brands
router.get('/:id', getBrand);       // Get single brand
router.put('/:id', updateBrand);    // Update brand
router.delete('/:id', deleteBrand); // Delete brand

export default router;