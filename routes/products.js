import express from 'express';
import { getProducts, deleteFile } from '../controllers/productController.js';
const getProductInfoRouter = express.Router();

getProductInfoRouter.get('/downloadProducts',getProducts);
getProductInfoRouter.delete('/deleteProducts',deleteFile);


export default getProductInfoRouter;
