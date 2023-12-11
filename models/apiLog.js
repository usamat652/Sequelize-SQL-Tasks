import { DataTypes} from 'sequelize';
import { sequelize } from '../config/connectDB.js';
// model for Log
const LogModel = sequelize.define('Log', {
  level: DataTypes.STRING,
  message: DataTypes.STRING,
  meta: DataTypes.JSON,
  statusCode: DataTypes.INTEGER,
},{timestamp: true});
// Sync the model with the database
LogModel.sync();

export default LogModel;