import express from 'express'
import {addProduct , getAllProducts, getProduct,updateProduct ,deleteProduct,getProductsWithVarient} from '../../controller/admin/product.controller.js';


const router =express.Router();



router.post('/',addProduct) //add product
router.get('/',getAllProducts)
router.get('/all',getProductsWithVarient)

router.get('/:id',getProduct)
router.put('/:id',updateProduct)
router.delete('/:id',deleteProduct)


export default router