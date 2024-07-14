// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const News = sequelize.define('news', {
  // 定义字段
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  datetime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hashcode: {
    type: DataTypes.STRING,
    allowNull: true,
    // create unique index in this column
    unique: true,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  // 选项
});

module.exports = { News };
