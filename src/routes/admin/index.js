import express from 'express';

import authRoutes  from './auth.routes.js';
import categoryRoutes  from './category.routes.js'
import brandRoutes from './brands.routes.js'

const router  = express.Router();


router.use('/auth', authRoutes)
router.use('/category',categoryRoutes )
router.use('/brand',brandRoutes)

export default router ;