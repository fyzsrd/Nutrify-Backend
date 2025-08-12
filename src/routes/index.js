import express from 'express';

import adminRoutes  from './admin/index.js';

const routes = express.Router();


routes.use('/admin', adminRoutes);


export default routes;