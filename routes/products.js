import express from 'express';
import { getProducts, deleteFile } from '../controllers/productController.js';
const productRouter = express.Router();

productRouter.get('/downloadProducts/:buyPrice',getProducts);
productRouter.post('/deleteProducts/:uuid',deleteFile);


export default productRouter;
