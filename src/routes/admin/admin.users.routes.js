import express from 'express'
import { getAllUsers, getUserById } from '../../controller/admin/admin.users.controller.js'

const router=express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)


export default router