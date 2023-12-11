import { sequelize } from "../config/connectDB.js";
import { Product } from "../models/products.js";
import { FailedApi, SuccessApi } from '../config/apiResponse.js';

const task19 = async (req, res) => {
    try {
        await Product.update(
          {
            buyPrice: sequelize.literal(`
              CASE
                WHEN productLine = 'Motorcycles' THEN ROUND(buyPrice * 1.15)
                WHEN productLine = 'Ships' THEN ROUND(buyPrice * 1.20) 
                ELSE buyPrice
              END
            `),
          },
          {
            where: {
              productLine: ['Motorcycles', 'Ships'],
            },
          }
        );
        
        let updatedData = await Product.findAll({
            attributes: {
                exclude: ['orderNumber'],
            },
        });

        SuccessApi(res, updatedData);
    } catch (error) {
        FailedApi(res, error.message);
    }
};

export default task19;
