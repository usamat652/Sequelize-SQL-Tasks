import { Product } from "../models/products.js";
import { OrderDetail } from "../models/orderdetails.js";
import { sequelize } from "../config/connectDB.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task4 = async (req, res) => {
    try {
        const result = await Product.findAll({
            attributes: [
                'productName',
                [sequelize.fn('COUNT', sequelize.col('orderNumber')), 'orderCount'],
            ],
            include: [
                {
                    model: OrderDetail,
                    attributes: [],  
                    required: true,                 
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

export default task4;




