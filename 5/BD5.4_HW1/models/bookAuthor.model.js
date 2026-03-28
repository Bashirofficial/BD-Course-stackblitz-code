let { DataTypes, sequelize } = require('../lib/index');

let { author } = require('./author.model');
let { book } = require('./book.model');

let bookAuthor = sequelize.define('bookAuthor', {
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: author,
      key: 'id',
    },
  },

  bookId: {
    type: DataTypes.INTEGER,
    references: {
      model: book,
      key: 'id',
    },
  },
});

author.belongsToMany(book, { through: bookAuthor });
book.belongsToMany(author, { through: bookAuthor });

module.exports = { bookAuthor };
