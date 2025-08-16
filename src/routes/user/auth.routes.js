import express from 'express'
import {generateOtp } from '../../controller/user/auth.controller.js'
const router=express.Router();


router.post('/',generateOtp)

export default router