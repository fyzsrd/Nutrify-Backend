import express from 'express'
import { getDashboardStats } from '../../controller/admin/admin.dashBoard.controller.js'

const router=express.Router()

router.get('/',getDashboardStats)

export default router