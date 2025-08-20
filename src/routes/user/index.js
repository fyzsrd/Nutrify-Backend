import express from 'express'
import authRoutes from "./auth.routes.js";
import cartRoutes from './cart.routes.js'
import userAuth from '../../middlewares/userAuth.middleware.js'
const router = express.Router();

router.use('/auth',authRoutes)
router.use(userAuth)
router.use('/cart',cartRoutes)

export default router;