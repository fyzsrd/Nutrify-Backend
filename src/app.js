import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'
import cors from 'cors'
import routes from './routes/index.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(cookieParser())
http://localhost:5173/categories/vitamins

// Routes
app.use('/api',routes);






connectDB().then(() => {

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}/`)
  });

}).catch(err => console.log('server didnt start due to: ', err.message))