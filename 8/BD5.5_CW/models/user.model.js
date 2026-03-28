let { DataTypes, sequelize } = require('../lib/index');

let user = sequelize.define('user', {
  username: DataTypes.TEXT,
  email: DataTypes.TEXT,
  password: DataTypes.TEXT,
});

module.exports = { user };
