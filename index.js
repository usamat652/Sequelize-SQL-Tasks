import express from 'express';
import productRouter from './routes/products.js';
import { syncModels } from './relationships/sync.js';
import customerRouter from './routes/customer.js';
import router from './queryRouters/allTasks.js';
import rateLimit from "express-rate-limit";
import logger from './config/apiLogs.js';
import LogModel from './models/apiLog.js';



const app = express();
app.use(express.json());
const PORT = 5000;
syncModels();

const limiter = rateLimit({
  windowMs: 30 * 1000, 
  max: 5, 
  message: "Too many request(s) from this IP, Please try again later",
});
app.use(limiter);

app.use((req, res, next) => {
  // Log request details
  const logData = {
    level: req.method,
    message: req.url,
    meta: req.body, 
  };
  let responseSent = false;
  res.on('finish', () => {
    if (!responseSent) {
      logData.statusCode = res.statusCode;
      LogModel.create(logData)
        .then(() => {
          responseSent = true;
          next();
        })
        .catch((error) => {
          console.error('Error saving log entry to Sequelize:', error);
          next();
        });
    }
  });
  next();
});

app.use((err, req, res, next) => {
  // Log errors
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use('/classicmodel', productRouter);
app.use('/classicmodel', customerRouter);
app.use('/queries', router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});