import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB.js';

 const Order = sequelize.define('Order', {
  orderNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  orderDate: {
    type: DataTypes.DATEONLY,
  },
  requiredDate: {
    type: DataTypes.DATEONLY,
  },
  shippedDate: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.STRING(15),
  },
  comments: {
    type: DataTypes.TEXT,
  }
},{
  timestamps: false
},
{
  tableName: 'orders', 
});



// Sync the model with the database (create the table if it doesn't exist)
//sequelize.sync();

export  {Order};