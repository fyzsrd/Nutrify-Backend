import express from 'express'
import homeRoutes from './public.home.routes.js'
import categoryRoutes from './category.routes.js'
import publicProductRoutes from './public.product.routes.js'
const router = express.Router();

router.use('/home',homeRoutes)
router.use("/categories", categoryRoutes);
router.use('/productBycatgeory',publicProductRoutes)
export default router;