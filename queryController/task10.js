import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Order } from "../models/orders.js";
import { OrderDetail } from "../models/orderdetails.js";
import { Product } from "../models/products.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task10 = async (req, res) => {
    try {
        const result = await Product.findAll({
            attributes: [
                'productName',
                [sequelize.fn('COUNT', sequelize.col('orderdetails.orderNumber')), 'No_of_times_sold']
            ],
            include: [
                {
                    model: OrderDetail,
                    attributes: [],
                    include: [
                        {
                            model: Order,
                            attributes: [],
                            include: [
                                {
                                    model: Customer,
                                    attributes: [],
                                    
                                }
                            ]
                        }
                    ],
                    
                }
            ],
            where: sequelize.literal("`country` = 'USA'"),
            group: ['productName', 'productCode'],
            order: [[sequelize.literal('No_of_times_sold'), 'DESC']]
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task10;
