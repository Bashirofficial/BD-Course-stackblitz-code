let { DataTypes, sequelize } = require('../lib/index');

let customer = sequelize.define('customer', {
  customerId: DataTypes.TEXT,
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = { customer };
