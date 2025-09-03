import express from 'express'
import {getProductsByCategory} from '../../controller/public/public.product.controller.js'

const router=express.Router();

router.get('/:id',getProductsByCategory)

export default router