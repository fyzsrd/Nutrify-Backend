import express from 'express'
import {addProduct , getAllProducts, getProduct,updateProduct ,deleteProduct,getProductsWithVarient ,getProductWithVariant} from '../../controller/admin/product.controller.js';


const router =express.Router();



router.post('/',addProduct) //add product
router.get('/',getAllProducts)
router.get('/panel',getProductsWithVarient)
router.get('/panel/:id',getProductWithVariant)



router.get('/:id',getProduct)
router.put('/:id',updateProduct)
router.delete('/:id',deleteProduct)


export default router