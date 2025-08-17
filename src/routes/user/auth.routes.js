import express from 'express'
import {generateOtp,verifyotp } from '../../controller/user/auth.controller.js'
const router=express.Router();


router.post('/',generateOtp)
router.post('/verify',verifyotp)

export default router