import express from 'express'
import {addProduct , getAllProducts, getProduct,updateProduct
     ,deleteProduct,getPanelProducts,getPanelProductDetails} from '../../controller/admin/product.controller.js';
import upload from '../../middlewares/multer.js';


const router =express.Router();



router.post('/',upload.array("images",6), addProduct) //add product
router.get('/',getAllProducts)

//for admin panel
router.get('/panel',getPanelProducts)
router.get('/panel/:id',getPanelProductDetails)




router.get('/:id',getProduct)
router.put('/:id',updateProduct)
router.delete('/:id',deleteProduct)


export default router