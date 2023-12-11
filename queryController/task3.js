import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Payment } from "../models/payments.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';



const task3 = async (req, res) => {
    try {
        const result = await Customer.findAll({
            attributes: ['customerNumber', 'customerName',
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
            include: [
                {
                    model: Payment,
                    attributes: []
                }
            ],
            group: ['customerNumber', 'customerName'],
            order: [[sequelize.literal('totalAmount'), 'DESC']]
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task3