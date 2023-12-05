import express from "express";
import customerDetails from "../controllers/customerController.js";
import {mergePDFs,  upload } from "../controllers/mergeFiles.js";
import orderDetails from "../controllers/orderController.js";

const customerRouter = express.Router();

customerRouter.get('/customerDetails/:customerNumber', customerDetails);
customerRouter.get('/orderDetails/:orderNumber', orderDetails);

customerRouter.post('/merge-pdfs', upload.array('pdfFiles', 10), mergePDFs);

export default customerRouter;

