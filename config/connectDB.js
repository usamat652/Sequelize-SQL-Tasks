import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('classicmodel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

export {sequelize};