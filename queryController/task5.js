import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Employee } from "../models/employees.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task5 = async (req, res) => {
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
            where: {
               employeeNumber: sequelize.literal('salesRepEmployeeNumber is null')
            }
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task5