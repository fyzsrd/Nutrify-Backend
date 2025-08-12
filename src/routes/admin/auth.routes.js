import express from 'express'

import {adminRegister , adminLogin} from '../../controller/admin/auth.controller.js'

const router =express.Router();

router .post('/signup',adminRegister)
router .post('/login',adminLogin)

export default router ;