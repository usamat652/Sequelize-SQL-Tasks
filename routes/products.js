import express from 'express';
import { getProducts } from '../controllers/productController.js';
const getProductInfoRouter = express.Router();

getProductInfoRouter.get('/downloadProducts',getProducts);

export default getProductInfoRouter;
