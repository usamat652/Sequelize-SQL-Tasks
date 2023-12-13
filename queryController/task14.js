import { Product } from "../models/products.js";
import { ProductLine } from "../models/productlines.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task14 = async (req, res) => {
    try {
        const result = await ProductLine.findAll({
            attributes: ['productLine'],
            include: [
                {
                    model: Product,
                    attributes: ['productName'],
                    required: false
                },
            ],
            order: [['productLine'], [Product, 'productName']]
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
};

export default task14;
