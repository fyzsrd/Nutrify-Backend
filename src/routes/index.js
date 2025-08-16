import express from 'express';

import adminRoutes  from './admin/index.js';
import userRoutes from './user/index.js'

const routes = express.Router();


routes.use('/admin', adminRoutes);
routes.use('/user', userRoutes);


export default routes;