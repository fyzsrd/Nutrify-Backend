import express from 'express'
import {addAddress,getAllAddress,updateAddress,deleteAddress} from '../../controller/user/address.controller.js'

const router=express.Router()

router.post('/',addAddress)
router.get('/',getAllAddress)
router.put('/:id',updateAddress)
router.delete('/:id',deleteAddress)






export default  router;