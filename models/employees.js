import { DataTypes} from 'sequelize';
import { sequelize } from '../config/connectDB.js';

 const Employee = sequelize.define('Employee', {
  employeeNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  lastName: {
    type: DataTypes.STRING(50),
  },
  firstName: {
    type: DataTypes.STRING(50),
  },
  extension: {
    type: DataTypes.STRING(10),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  officeCode: {
    type: DataTypes.STRING(10),
  },
  reportsTo: {
    type: DataTypes.INTEGER,
  },
  jobTitle: {
    type: DataTypes.STRING(50),
  },
}, {
  timestamps: false
},
{
  tableName: 'employees', 
});



export  {Employee};