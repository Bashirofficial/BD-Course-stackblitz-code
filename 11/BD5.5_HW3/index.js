const express = require('express');
const app = express();
let { favorite } = require('./models/favorite.model');
let { recipe } = require('./models/recipe.model');
let { user } = require('./models/user.model');
let { sequelize } = require('./lib/index');
let { Op } = require('@sequelize/core');

let PORT = process.env.PORT || 3000;

let recipes = [
  {
    title: 'Spaghetti Carbonara',
    chef: 'Chef Luigi',
    cuisine: 'Italian',
    preparationTime: 30,
    instructions:
      'Cook spaghetti. In a bowl, mix eggs, cheese, and pepper. Combine with pasta and pancetta.',
  },
  {
    title: 'Chicken Tikka Masala',
    chef: 'Chef Anil',
    cuisine: 'Indian',
    preparationTime: 45,
    instructions:
      'Marinate chicken in spices and yogurt. Grill and serve with a creamy tomato sauce.',
  },
  {
    title: 'Sushi Roll',
    chef: 'Chef Sato',
    cuisine: 'Japanese',
    preparationTime: 60,
    instructions:
      'Cook sushi rice. Place rice on nori, add fillings, roll, and slice into pieces.',
  },
  {
    title: 'Beef Wellington',
    chef: 'Chef Gordon',
    cuisine: 'British',
    preparationTime: 120,
    instructions:
      'Wrap beef fillet in puff pastry with mushroom duxelles and bake until golden.',
  },
  {
    title: 'Tacos Al Pastor',
    chef: 'Chef Maria',
    cuisine: 'Mexican',
    preparationTime: 50,
    instructions:
      'Marinate pork in adobo, grill, and serve on tortillas with pineapple and cilantro.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create({
      username: 'foodlover',
      email: 'foodlover@example.com',
      password: 'securepassword',
    });
    await recipe.bulkCreate(recipes);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function favoriteRecipe(data) {
  let newfavorite = await favorite.create({
    userId: data.userId,
    recipeId: data.recipeId,
  });
  return { message: 'recipe favorited', newfavorite };
}

app.get('/users/:id/favorite', async (req, res) => {
  try {
    let userId = req.params.id;
    let recipeId = req.query.recipeId;
    let response = await favoriteRecipe({ userId, recipeId });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function unfavoriteRecipe(data) {
  let count = await favorite.destroy({
    where: {
      userId: data.userId,
      recipeId: data.recipeId,
    },
  });

  if (count === 0) return {};

  return { message: 'Recipe is marked as  not favorite' };
}

app.get('/users/:id/unfavorite', async (req, res) => {
  try {
    let userId = req.params.id;
    let recipeId = req.query.recipeId;
    let response = await unfavoriteRecipe({ userId, recipeId });
    if (!response.message) {
      res
        .status(404)
        .json({ message: 'This recipe is not in your favorited list.' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllfavoritedRecipes(userId) {
  let recipeIds = await favorite.findAll({
    where: { userId },
    attributes: ['recipeId'],
  });
  let recipeRecords = [];

  for (let i = 0; i < recipeIds.length; i++) {
    recipeRecords.push(recipeIds[i].recipeId);
  }

  let favoritedrecipes = await recipe.findAll({
    where: { id: { [Op.in]: recipeRecords } },
  });
  return { favoritedrecipes };
}

app.get('/users/:id/favorites', async (req, res) => {
  try {
    let userId = req.params.id;

    let response = await getAllfavoritedRecipes(userId);
    if (response.favoritedrecipes.length === 0)
      return res.status(404).json({ message: 'No favorited recipes found' });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

