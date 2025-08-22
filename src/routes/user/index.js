import express from 'express'
import authRoutes from "./auth.routes.js";
import cartRoutes from './cart.routes.js'
import userAuth from '../../middlewares/userAuth.middleware.js'
import addressRoutes from './address.route.js'
import prodileRoutes from './profile.routes.js'
const router = express.Router();

router.use('/auth',authRoutes)
router.use(userAuth)
router.use('/cart',cartRoutes)
router.use('/address',addressRoutes)
router.use('/profile',prodileRoutes)

export default router;