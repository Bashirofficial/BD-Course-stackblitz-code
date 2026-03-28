let { DataTypes, sequelize } = require('../lib/index');

let { movie } = require('./movie.model');
let { user } = require('./user.model');

let like = sequelize.define('like', {
  movieId: {
    type: DataTypes.INTEGER,
    references: {
      model: movie,
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

movie.belongsToMany(user, { through: like });
user.belongsToMany(movie, { through: like });

module.exports = { like };
