import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDB.js";
 const ProductLine = sequelize.define('ProductLine', {
  productLine: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  textDescription: {
    type: DataTypes.STRING(4000),
  },
  htmlDescription: {
    type: DataTypes.TEXT('medium'),
  },
  image: {
    type: DataTypes.BLOB('medium'),
  },
},{
  timestamps: false
},
{
    tableName: 'productlines', 
  });

export  {ProductLine};