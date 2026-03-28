let { DataTypes, sequelize } = require('../lib/index');

let { track } = require('./track.model');
let { user } = require('./user.model');

let like = sequelize.define('like', {
  trackId: {
    type: DataTypes.INTEGER,
    references: {
      model: track,
      key: 'id',
    },
  },

  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
  },
});

track.belongsToMany(user, { through: like });
user.belongsToMany(track, { through: like });

module.exports = { like };
