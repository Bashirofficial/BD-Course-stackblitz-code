const express = require('express');
const app = express();
let { chef } = require('./models/chef.model');
let { dish } = require('./models/dish.model');
let { chefDish } = require('./models/chefDish.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

app.use(express.json());


let dishes = [
  {
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    preparationTime: 20,
  },
  {
    name: 'Sushi',
    cuisine: 'Japanese',
    preparationTime: 50,
  },
  {
    name: 'Poutine',
    cuisine: 'Canadian',
    preparationTime: 30,
  },
]

let chefs = [
  { name: 'Gordon Ramsay', birthYear: 1966 },
  { name: 'Masaharu Morimoto', birthYear: 1955 },
  { name: 'Ricardo Larrivée', birthYear: 1967 },
]


app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await dish.bulkCreate(dishes);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewChef(newChef) {
  let chefData = await chef.create(newChef);
  return { chefData };
}

app.post('/chefs/new', async (req, res) => {
  try {
    let newChef = req.body.newChef;
    let response = await addNewChef(newChef);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updatechefById(id, newChefData) {
  let chefDetails = await chef.findOne({ where: { id } });
  if (!chefDetails) {
    return {};
  }
  chefDetails.set(newChefData);
  let updatedchef = await chefDetails.save();

  return { message: 'chef updated successfully', updatedchef };
}

app.post('/chefs/update/:id', async (req, res) => {
  try {
    let newChefData = req.body;
    let id = parseInt(req.params.id);
    let response = await updatechefById(id, newChefData);

    if (!response.message) {
      return res.status(404).json({ message: 'chef not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
