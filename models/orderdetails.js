import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB.js';



 const OrderDetail = sequelize.define('OrderDetail', {
  orderNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  productCode: {
    type: DataTypes.STRING(15),
    primaryKey: true,
  },
  quantityOrdered: {
    type: DataTypes.INTEGER,
  },
  priceEach: {
    type: DataTypes.DECIMAL(10, 2),
  },
  orderLineNumber: {
    type: DataTypes.SMALLINT,
  }
}, {
  timestamps: false
},
{
  tableName: 'orderdetails', 
});

export  {OrderDetail};