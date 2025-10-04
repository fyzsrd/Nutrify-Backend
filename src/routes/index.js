import express from 'express';
import publicRoutes from './public/index.js'
import adminRoutes  from './admin/index.js';
import userRoutes from './user/index.js'

const routes = express.Router();


routes.use('/admin', adminRoutes);
routes.use('/user', userRoutes);
routes.use('/nutrify',publicRoutes)


export default routes;