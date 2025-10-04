import express from 'express'
import { addVarient,getvariants,getVariant,updateVariant,deleteVariant } from '../../controller/admin/varient.controller.js';
import upload from '../../middlewares/multer.js';
const router=express.Router();


router.post('/',upload.single('images'),addVarient);
router.get('/',getvariants);
router.get('/:id',getVariant);
router.put('/:id',updateVariant);
router.delete('/:id',deleteVariant)

export default router