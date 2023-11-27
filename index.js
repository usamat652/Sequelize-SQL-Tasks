import express from 'express';
import getProductInfoRouter from './routes/products.js';
// import { getCsv,getProducts } from './controllers/productController.js';
import { syncModels } from './sync.js';
import getCustomerInfoRouter from './routes/customer.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
syncModels();

app.use('/api',getProductInfoRouter);
app.use('/api', getCustomerInfoRouter)
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });