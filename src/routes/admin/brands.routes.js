import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  getBrandNames
} from '../../controller/admin/brands.controller.js'
import upload from '../../middlewares/multer.js';



const router = express.Router()

router.post('/',upload.single("logo"), addBrand);         // Create brand
router.get('/', getBrands);      
router.get('/panel', getBrandNames);   // Get all brands
router.get('/:id', getBrand);       // Get single brand
router.put('/:id',upload.single("logo"), updateBrand);    // Update brand
router.delete('/:id', deleteBrand); // Delete brand

export default router;