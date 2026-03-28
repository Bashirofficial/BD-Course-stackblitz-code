const express = require('express');
const app = express();
let { author } = require('./models/author.model');
let { book } = require('./models/book.model');
let { bookAuthor } = require('./models/bookAuthor.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

app.use(express.json());

let books = [
  {
    title: `Harry Potter and the Philosopher's Stone`,
    genre: 'Fantasy',
    publicationYear: 1997,
  },
  { title: 'A Game of Thrones', genre: 'Fantasy', publicationYear: 1996 },
  { title: 'The Hobbit', genre: 'Fantasy', publicationYear: 1937 },
];

let authors = [{ name: 'J.K Rowling', birthYear: 1965 }];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(books);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewAuthor(newAuthor) {
  let authorData = await author.create(newAuthor);
  return { authorData };
}

app.post('/authors/new', async (req, res) => {
  try {
    let newAuthor = req.body.newAuthor;
    let response = await addNewAuthor(newAuthor);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updateAuthorById(id, newAuthorData) {
  let authorDetails = await author.findOne({ where: { id } });
  if (!authorDetails) {
    return {};
  }
  authorDetails.set(newAuthorData);
  let updatedUser = await authorDetails.save();

  return { message: 'User updated successfully', updatedUser };
}

app.post('/authors/update/:id', async (req, res) => {
  try {
    let newAuthorData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateAuthorById(id, newAuthorData);

    if (!response.message) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
