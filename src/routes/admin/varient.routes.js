import express from 'express'
import { addVarient,getvariants,getVariant,updateVariant,deleteVariant } from '../../controller/admin/varient.controller.js';

const router=express.Router();


router.post('/',addVarient);
router.get('/',getvariants);
router.get('/:id',getVariant);
router.put('/:id',updateVariant);
router.delete('/:id',deleteVariant)

export default router