// database.js
const { Sequelize } = require('sequelize');
const path = require('path');

console.log('Database connecting..., path:', path.join(__dirname, '../db/database.sqlite'));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/database.sqlite'),
  logging: true 
});

(async () => {
  try {
    await sequelize.sync({ force: false, alter: true }); // `force: true` delete all table and rebuild
  } catch (error) {
    console.error('Database sync model failed:', error);
  } finally {
  }
})();

module.exports = sequelize;
