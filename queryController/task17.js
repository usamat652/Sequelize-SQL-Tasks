import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import {OrderDetail} from "../models/orderdetails.js";
import { Order } from "../models/orders.js";
import { Payment } from "../models/payments.js";
import { Product } from "../models/products.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task17 = async (req, res) => {
    try {
        const result = await Product.findAll({
            attributes: [
                'productLine',
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalPayment']
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
                                    include: [
                                        {
                                            model: Payment,
                                            attributes: [],
                                            required: false
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    
                }
            ],
            group: ['productLine'],
            order: [[sequelize.literal('totalPayment'), 'DESC']]
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task17;
