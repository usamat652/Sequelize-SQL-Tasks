import express from "express";
import customerDetails from "../controllers/customerController.js";
import mergePDFs from "../controllers/mergeFiles.js";
const getCustomerInfoRouter = express.Router();

getCustomerInfoRouter.get('/customerDetails/:customerNumber', customerDetails);
getCustomerInfoRouter.get('/customers/mergePDF', mergePDFs);

export default getCustomerInfoRouter;

