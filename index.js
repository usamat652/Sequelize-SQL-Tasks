import express from 'express';
import productRouter from './routes/products.js';
import { syncModels } from './relationships/sync.js';
import customerRouter from './routes/customer.js';

const app = express();
app.use(express.json());
const PORT = 5000;
syncModels();

app.use('/classicmodel',productRouter);
app.use('/classicmodel', customerRouter);


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });