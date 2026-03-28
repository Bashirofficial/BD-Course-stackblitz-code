let { DataTypes, sequelize } = require('../lib/index');

let user = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNUll: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNUll: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNUll: false,
  },
});

module.exports = { user };
