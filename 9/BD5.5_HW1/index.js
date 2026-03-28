const express = require('express');
const app = express();
let { like } = require('./models/like.model');
let { book } = require('./models/book.model');
let { user } = require('./models/user.model');
let { sequelize } = require('./lib/index');
let { Op } = require('@sequelize/core');

let books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    year: 1960,
    summary: 'A novel about the serious issues of rape and racial inequality.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    year: 1949,
    summary:
      'A novel presenting a dystopian future under a totalitarian regime.',
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    year: 1851,
    summary:
      'The narrative of the sailor Ishmael and the obsessive quest of Ahab.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    year: 1813,
    summary:
      'A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    year: 1925,
    summary: 'A novel about the American dream and the roaring twenties.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create({
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testuser',
    });
    await book.bulkCreate(books);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function likebook(data) {
  let newLike = await like.create({
    userId: data.userId,
    bookId: data.bookId,
  });
  return { message: 'book Liked', newLike };
}

app.get('/users/:id/like', async (req, res) => {
  try {
    let userId = req.params.id;
    let bookId = req.query.bookId;
    let response = await likebook({ userId, bookId });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function dislikebook(data) {
  let count = await like.destroy({
    where: {
      userId: data.userId,
      bookId: data.bookId,
    },
  });

  if (count === 0) return {};

  return { message: 'book disliked' };
}

app.get('/users/:id/dislike', async (req, res) => {
  try {
    let userId = req.params.id;
    let bookId = req.query.bookId;
    let response = await dislikebook({ userId, bookId });
    if (!response.message) {
      res.status(404).json({ message: 'This book is not in your liked list.' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllLikedbooks(userId) {
  let bookIds = await like.findAll({
    where: { userId },
    attributes: ['bookId'],
  });
  let bookRecords = [];

  for (let i = 0; i < bookIds.length; i++) {
    bookRecords.push(bookIds[i].bookId);
  }

  let likedbooks = await book.findAll({
    where: { id: { [Op.in]: bookRecords } },
  });
  return { likedbooks };
}

app.get('/users/:id/liked', async (req, res) => {
  try {
    let userId = req.params.id;

    let response = await getAllLikedbooks(userId);
    if (response.likedbooks.length === 0)
      return res.status(404).json({ message: 'No liked books found' });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllLikedbooksByArtists(userId, artist) {
  let bookIds = await like.findAll({
    where: { userId },
    attributes: ['bookId'],
  });
  let bookRecords = [];

  for (let i = 0; i < bookIds.length; i++) {
    bookRecords.push(bookIds[i].bookId);
  }

  let likedbooks = await book.findAll({
    where: { id: { [Op.in]: bookRecords }, artist },
  });
  return { likedbooks };
}

app.get('/users/:id/liked-artist', async (req, res) => {
  try {
    let userId = req.params.id;
    let artist = req.query.artist;
    let response = await getAllLikedbooksByArtists(userId, artist);
    if (response.likedbooks.length === 0)
      return res.status(404).json({ message: 'No liked books found' });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
