import { Employee } from "../models/employees.js";
import { Office } from "../models/offices.js";
import { sequelize } from "../config/connectDB.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task16 = async (req, res) => {
    try {
        const result = await Office.findAll({
            attributes: ['city',
            [sequelize.fn('COUNT', sequelize.col('employeeNumber')), 'NumberOfEmployees'],
        ],
            include: [
                {
                    model: Employee,
                    attributes: [],
                    required: false,
                },
            ],
            group: ['city'], // Group only by non-aggregated fields
            order: [[sequelize.literal('NumberOfEmployees'), 'DESC']], // Use the correct alias in the order option
        });

        SuccessApi(res, result)

    } catch (error) {
        FailedApi(res, error.message)

    }
};

export default task16;
