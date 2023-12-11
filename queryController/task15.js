import { Customer } from "../models/customers.js";
import { Payment } from "../models/payments.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task15 = async (req, res) => {
    try {
        const result = await Customer.findAll({
            attributes: ['customerName'],
            include: [
                {
                    model: Payment,
                    attributes: ['paymentDate', 'amount'],
                    required: false,
                }
            ],
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task15