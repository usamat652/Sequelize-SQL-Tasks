import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Employee } from "../models/employees.js";
import { Op } from 'sequelize'
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task9 = async (req, res) => {
    try {
        const result = await Employee.findAll({
            attributes: ['firstName', 'lastName'],
            include: [
                {
                    model: Customer,
                    attributes: [],
                    required: false,

                },
            ],
            where: {
                [Op.and]: [
                    {
                        employeeNumber: sequelize.literal('salesRepEmployeeNumber is null')
                    },
                    {
                        officeCode: 1
                    }
                ]
            },
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
}

export default task9