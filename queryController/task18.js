import { sequelize } from "../config/connectDB.js";
import { Customer } from "../models/customers.js";
import { Payment } from "../models/payments.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';


const task18 = async (req, res) => {
  try {
    const subquery = await Payment.findAll({
      attributes: [
        'customerNumber',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],

      ],
      include:[{
        model:Customer,
        attributes:[],
        required:true,

      }],
      group: ['customerNumber'],
    });
    
    for (const paymentTotal of subquery) {
      const customerNumber = paymentTotal.getDataValue('customerNumber');
      const totalAmount = paymentTotal.getDataValue('total_amount');
      const customer = await customers.findByPk(customerNumber);
      if (customer) {
        let updatedCreditLimit;
        if (totalAmount > 1000) {
          updatedCreditLimit = Math.round(customer.creditLimit * 1.1);
        } 
        if(updatedCreditLimit>50000)
        {
          updatedCreditLimit = Math.min(customer.creditLimit, 50000);
        }
        
        await customer.update({ creditLimit: updatedCreditLimit });
      }
    }

    SuccessApi(res, updatedData)

  } catch (error) {
      FailedApi(res, error.message)

  }
};

export default task18;
