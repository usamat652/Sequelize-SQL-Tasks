import { Product } from "../models/products.js";
import { OrderDetail } from "../models/orderdetails.js";
import { sequelize } from "../config/connectDB.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task8 = async (req, res) => {
    try {
        const result = await Product.findAll({
            attributes: [
                'productName',
                [sequelize.fn('SUM', sequelize.col('quantityOrdered')), 'orderCount'],
            ],
            include: [
                {
                    model: OrderDetail,
                    attributes: [],
                },
            ],
            group: ['productName'],
            order: [[sequelize.literal('orderCount'), 'DESC']]
        });
        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
};

export default task8;




