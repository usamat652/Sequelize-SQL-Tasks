import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB.js'; 


 const Payment = sequelize.define('Payment', {
  customerNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  checkNumber: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
},{
  timestamps: false
},
 {
  tableName: 'payments', 
});


export  {Payment};