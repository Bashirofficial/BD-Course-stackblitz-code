let { DataTypes, sequelize } = require('../lib/index');

let dish = sequelize.define('dish', {
  name: DataTypes.TEXT,
  cuisine: DataTypes.TEXT,
  preparationTime: DataTypes.INTEGER,
});

module.exports = { dish };
