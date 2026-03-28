const express = require('express');
const app = express();
let { like } = require('./models/like.model');
let { movie } = require('./models/movie.model');
let { user } = require('./models/user.model');
let { sequelize } = require('./lib/index');
let { Op } = require('@sequelize/core');

let PORT = process.env.PORT || 3000;

let movies = [
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    year: 2010,
    summary:
      'A skilled thief is given a chance at redemption if he can successfully perform an inception.',
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    genre: 'Crime',
    year: 1972,
    summary:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genre: 'Crime',
    year: 1994,
    summary:
      'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.',
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action',
    year: 2008,
    summary:
      'When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    genre: 'Drama',
    year: 1994,
    summary:
      'The presidencies of Kennedy and Johnson, the Vietnam War, and other events unfold from the perspective of an Alabama man with an IQ of 75.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create({
      username: 'moviefan',
      email: 'moviefan@gmail.com',
      password: 'password123',
    });
    await movie.bulkCreate(movies);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function likemovie(data) {
  let newLike = await like.create({
    userId: data.userId,
    movieId: data.movieId,
  });
  return { message: 'movie Liked', newLike };
}

app.get('/users/:id/like', async (req, res) => {
  try {
    let userId = req.params.id;
    let movieId = req.query.movieId;
    let response = await likemovie({ userId, movieId });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function dislikemovie(data) {
  let count = await like.destroy({
    where: {
      userId: data.userId,
      movieId: data.movieId,
    },
  });

  if (count === 0) return {};

  return { message: 'movie disliked' };
}

app.get('/users/:id/dislike', async (req, res) => {
  try {
    let userId = req.params.id;
    let movieId = req.query.movieId;
    let response = await dislikemovie({ userId, movieId });
    if (!response.message) {
      res
        .status(404)
        .json({ message: 'This movie is not in your liked list.' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllLikedmovies(userId) {
  let movieIds = await like.findAll({
    where: { userId },
    attributes: ['movieId'],
  });
  let movieRecords = [];

  for (let i = 0; i < movieIds.length; i++) {
    movieRecords.push(movieIds[i].movieId);
  }

  let likedmovies = await movie.findAll({
    where: { id: { [Op.in]: movieRecords } },
  });
  return { likedmovies };
}

app.get('/users/:id/liked', async (req, res) => {
  try {
    let userId = req.params.id;

    let response = await getAllLikedmovies(userId);
    if (response.likedmovies.length === 0)
      return res.status(404).json({ message: 'No liked movies found' });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
