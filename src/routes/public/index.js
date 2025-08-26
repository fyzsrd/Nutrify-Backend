import express from 'express'
import homeRoutes from './home.routes.js'
import categoryRoutes from './category.routes.js'
const router = express.Router();

router.use('/home',homeRoutes)
router.use("/categories", categoryRoutes);
export default router;