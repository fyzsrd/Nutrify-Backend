import express from "express";

import {getCart ,clearUserCart, addItemToCart,deleteCartItem} from '../../controller/user/cart.controller.js'



const router =express.Router()

router.get('/',getCart)

router.post('/',addItemToCart)
router.delete('/clear',clearUserCart)
router.delete('/:id',deleteCartItem)


export default router