import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Payment } from "../models/payments.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';

const task7 = async (req, res) => {
    try {
        const result = await Customer.findAll({
            attributes: [
                'city',
                [sequelize.fn('AVG', sequelize.col('amount')), 'avgPayment']
            ],
            include: [
                {
                    model: Payment,
                    attributes: []
                }
            ],
            group: ['city'],
            having: sequelize.literal('avgPayment > 1000'),
            order: [[sequelize.literal('avgPayment'), 'DESC']]
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task7