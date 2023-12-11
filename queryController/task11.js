import { Product } from "../models/products.js";
import { ProductLine } from "../models/productlines.js";
import { OrderDetail } from "../models/orderdetails.js";
import { sequelize } from "../config/connectDB.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task11 = async (req, res) => {
    try {
        const result = await ProductLine.findAll({
            attributes: [
                'productLine',
                [sequelize.fn('SUM', sequelize.literal('priceEach * quantityOrdered')), 'totalRevenue'],
            ],
            include: [
                {
                    model: Product,
                    attributes: [],
                    include: [
                        {
                            model: OrderDetail,
                            attributes: [],
                        }
                    ],
                },
            ],
            group: ['productLine'],
            order: [[sequelize.literal('totalRevenue'), 'DESC']]
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
};

export default task11;
