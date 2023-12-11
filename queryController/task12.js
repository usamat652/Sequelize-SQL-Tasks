import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Order } from "../models/orders.js";
import { Payment } from "../models/payments.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task12 = async (req, res) => {
    try {
        const result = await Customer.findAll({
            attributes: ['customerName'],
            include: [
                {
                    model: Order,
                    attributes: ['orderNumber'],
                },
                {
                    model: Payment,
                    attributes: ['amount'],
                },
            ],
            having: sequelize.literal('orderNumber IS NOT NULL'),
            order: [['customerName', 'ASC']],
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
};

export default task12;
