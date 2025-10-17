import express from 'express'
import { initiateOrder } from '../../controller/user/user.orders.controller.js'

const router = express.Router()
router.get('/initiate',initiateOrder)

export default router