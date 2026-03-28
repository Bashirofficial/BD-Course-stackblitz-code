let { DataTypes, sequelize } = require('../lib/index');

let ticket = sequelize.define('ticket', {
  ticketId: DataTypes.TEXT,
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  status: DataTypes.TEXT,
  priority: DataTypes.INTEGER,
  customerId: DataTypes.INTEGER,
  agentId: DataTypes.INTEGER,
});

module.exports = { ticket };
