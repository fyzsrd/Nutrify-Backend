import express from 'express'
import {getHomeData,getProductDetail} from '../../controller/public/home.controller.js'
const router = express.Router()

router.get('/',getHomeData)
router.get('/:id',getProductDetail)

export default router 