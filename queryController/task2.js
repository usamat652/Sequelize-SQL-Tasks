import { Customer } from '../models/customers.js';
import { Order } from '../models/orders.js';
import { sequelize } from '../config/connectDB.js';
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task2 = async (req, res) => {
  try {
    const result = await Customer.findAll({
      attributes: [
        'customerName',
        [sequelize.fn('COUNT', sequelize.col('orderNumber')), 'orderCount'],
      ],
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
      group: ['customerName'],
      order: [[sequelize.literal('orderCount'), 'DESC']],
    });

    SuccessApi(res, result)

  } catch (error) {
    FailedApi(res, error.message)
  }
};

export default task2