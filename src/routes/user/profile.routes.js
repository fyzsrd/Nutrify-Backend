import express from 'express'
import {addOrUpdateUser} from '../../controller/user/profile.controller.js'
const router = express.Router()

router.post('/',addOrUpdateUser)

export default router