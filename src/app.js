import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'

import routes from './routes/index.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())

// Routes
app.use('/api',routes);






connectDB().then(() => {

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}/`)
  });

}).catch(err => console.log('server didnt start due to: ', err.message))