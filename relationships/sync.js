import { sequelize } from '../config/connectDB.js';
import {OrderDetail} from '../models/orderdetails.js';
import {Order} from '../models/orders.js';
import {Product} from '../models/products.js';
import {ProductLine} from '../models/productlines.js';
import { Customer } from '../models/customers.js';
import { Payment } from '../models/payments.js';
import { Employee } from '../models/employees.js';
import { Office } from '../models/offices.js';

// Define associations

ProductLine.hasMany(Product, { foreignKey: "productLine" });

Product.belongsTo(ProductLine, { foreignKey: "productLine" });
Product.hasMany(OrderDetail, { foreignKey: "productCode" });

OrderDetail.belongsTo(Product, { foreignKey: "productCode" });
OrderDetail.belongsTo(Order, { foreignKey: "orderNumber" });

Customer.belongsTo(Employee, { foreignKey: "salesRepEmployeeNumber" });
Customer.hasMany(Payment, { foreignKey: "customerNumber" });
Customer.hasMany(Order, { foreignKey: "customerNumber" });

Employee.hasMany(Customer, { foreignKey: "salesRepEmployeeNumber", as: 'Customers' });
Employee.belongsTo(Office, { foreignKey: "officeCode" });

Order.hasMany(OrderDetail, { foreignKey: "orderNumber" });
Order.hasMany(ProductLine, { foreignKey: 'orderId' });
Order.belongsTo(Customer, { foreignKey: "customerNumber" });

Office.hasMany(Employee, { foreignKey: "officeCode" });
Payment.belongsTo(Customer, { foreignKey: "customerNumber" });

Order.hasMany(Product, { foreignKey: 'orderNumber' });
Product.belongsTo(Order, { foreignKey: 'orderNumber' });

async function syncModels() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync(); 
      console.log('Models synchronized with the database.');
    } catch (error) {
      console.error('Error syncing models with the database:', error);
    }
  }

export {syncModels};