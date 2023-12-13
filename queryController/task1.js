import { SuccessApi, FailedApi } from '../config/apiResponse.js';
import { Product } from '../models/products.js';


const task1 = async (req, res) => {
  try {
    const result = await Product.findAll({
      attributes: ['productName', 'productLine'],
    });

    SuccessApi(res, result)
  } catch (error) {
    FailedApi(res, error.message)
  }
};

export default task1;
