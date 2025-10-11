import express from 'express';

import authRoutes  from './auth.routes.js';
import categoryRoutes  from './category.routes.js'
import brandRoutes from './brands.routes.js'
import productRoutes from './product.route.js'
import varientRoutes from './varient.routes.js'
import customerRoutes from './admin.users.routes.js'
import dashBoardRoutes from './admin.dashBoard.routes.js'
import { protect } from '../../middlewares/authMiddleware.js';

const router  = express.Router();



router.use('/auth', authRoutes)
//ptotected routes
router.use(protect); 
router.use('/category',categoryRoutes )
router.use('/brand',brandRoutes)
router.use('/product',productRoutes)
router.use('/variant',varientRoutes)
router.use('/customer',customerRoutes)
router.use('/dashboard',dashBoardRoutes)
export default router ;