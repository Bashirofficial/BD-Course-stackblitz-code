let { DataTypes, sequelize } = require('../lib/index');

let { book } = require('./book.model');
let { user } = require('./user.model');

let like = sequelize.define('like', {
  bookId: {
    type: DataTypes.INTEGER,
    references: {
      model: book,
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

book.belongsToMany(user, { through: like });
user.belongsToMany(book, { through: like });

module.exports = { like };
