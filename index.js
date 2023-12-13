import express from 'express';
import productRouter from './routes/products.js';
import { syncModels } from './relationships/sync.js';
import customerRouter from './routes/customer.js';
import router from './queryRouters/allTasks.js';
import rateLimit from "express-rate-limit";
// import logger from './config/apiLogs.js';
// import LogModel from './models/apiLog.js';
import logRequestDetails from './config/apiLogs.js';


const app = express();
app.use(express.json());
const PORT = 5000;
syncModels();

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 5,
  message: { error: "Too many requests from this IP at the same type. Please try again later." },
});

app.use(limiter);


app.use(logRequestDetails)

app.use('/classicmodel', productRouter);
app.use('/classicmodel', customerRouter);
app.use('/queries', router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});