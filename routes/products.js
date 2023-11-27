import express from 'express';
import { getProducts,getCsv } from '../controllers/productController.js';
const getProductInfoRouter = express.Router();

getProductInfoRouter.get('/downloadProducts',getProducts);
getProductInfoRouter.get('/downloadCsv',getCsv);

export default getProductInfoRouter;
