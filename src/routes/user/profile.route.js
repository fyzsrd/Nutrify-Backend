import express from 'express'
import {addAddress,getAllAddress,updateAddress,deleteAddress} from '../../controller/user/profile.controller.js'

const router=express.Router()

router.post('/address',addAddress)
router.get('/address',getAllAddress)
router.put('/address/:id',updateAddress)
router.delete('/address/:id',deleteAddress)
export default  router;