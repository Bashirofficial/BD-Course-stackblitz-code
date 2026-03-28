let { DataTypes, sequelize } = require('../lib/index');

let agent = sequelize.define('agent', {
  agentId: DataTypes.TEXT,
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = { agent };
