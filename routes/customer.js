import express from "express";
import customerDetails from "../controllers/customerController.js";
const app = express();
const getCustomerInfoRouter = express.Router();

getCustomerInfoRouter.get('/customerDetails/:customerNumber', customerDetails);

export default getCustomerInfoRouter;

