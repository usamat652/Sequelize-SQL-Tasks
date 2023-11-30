import express from 'express';
import getProductInfoRouter from './routes/products.js';
import { syncModels } from './relationships/sync.js';
import getCustomerInfoRouter from './routes/customer.js';

const app = express();
app.use(express.json());
const PORT = 5000;
syncModels();

app.use('/classicmodel',getProductInfoRouter);
app.use('/classicmodel', getCustomerInfoRouter);


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });