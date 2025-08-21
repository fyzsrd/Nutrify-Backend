import express from 'express'
import authRoutes from "./auth.routes.js";
import cartRoutes from './cart.routes.js'
import userAuth from '../../middlewares/userAuth.middleware.js'
import profileRoutes from './profile.route.js'
const router = express.Router();

router.use('/auth',authRoutes)
router.use(userAuth)
router.use('/cart',cartRoutes)
router.use('/profile',profileRoutes)

export default router;