let { DataTypes, sequelize } = require('../lib/index');

let course = sequelize.define('course', {
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
});

module.exports = { course };
