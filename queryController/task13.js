import { Employee } from "../models/employees.js";
import { Customer } from "../models/customers.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task13 = async (req, res) => {
    try {
        const result = await Employee.findAll({
            attributes: ['firstName', 'lastName'],
            include: [
                {
                    model: Customer,
                    attributes: ['customerName'],
                    required: false,
                },
            ],
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task13;
