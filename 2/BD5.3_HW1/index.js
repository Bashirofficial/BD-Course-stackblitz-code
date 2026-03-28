const express = require('express');
const app = express();
let { post } = require('./models/post.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

let  posts = [
  {
    title: 'Getting Started with Node.js',
    content:
      'This post will guide you through the basics of Node.js and how to set up a Node.js project.',
    author: 'Alice Smith',
  },
  {
    title: 'Advanced Express.js Techniques',
    content:
      'Learn advanced techniques and best practices for building applications with Express.js.',
    author: 'Bob Johnson',
  },
  {
    title: 'ORM with Sequelize',
    content:
      'An introduction to using Sequelize as an ORM for Node.js applications.',
    author: 'Charlie Brown',
  },
  {
    title: 'Boost Your JavaScript Skills',
    content:
      'A collection of useful tips and tricks to improve your JavaScript programming.',
    author: 'Dana White',
  },
  {
    title: 'Designing RESTful Services',
    content: 'Guidelines and best practices for designing RESTful APIs.',
    author: 'Evan Davis',
  },
  {
    title: 'Mastering Asynchronous JavaScript',
    content:
      'Understand the concepts and patterns for writing asynchronous code in JavaScript.',
    author: 'Fiona Green',
  },
  {
    title: 'Modern Front-end Technologies',
    content:
      'Explore the latest tools and frameworks for front-end development.',
    author: 'George King',
  },
  {
    title: 'Advanced CSS Layouts',
    content:
      'Learn how to create complex layouts using CSS Grid and Flexbox.',
    author: 'Hannah Lewis',
  },
  {
    title: 'Getting Started with React',
    content: `A beginner's guide to building user interfaces with React.`,
    author: 'Ian Clark',
  },
  {
    title: 'Writing Testable JavaScript Code',
    content:
      'An introduction to unit testing and test-driven development in JavaScript.',
    author: 'Jane Miller',
  },
]
app.use(express.json());

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await post.bulkCreate(posts);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllposts() {
  let posts = await post.findAll();
  return { posts: posts };
}
app.get('/posts', async (req, res) => {
  try {
    let response = await fetchAllposts();
    if (response.posts === null) {
      return res.status(404).json({ message: 'No post found. ' });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewpost(newpost) {
  let postData = await post.create(newpost);
  return { postData };
}

app.post('/posts/new', async (req, res) => {
  try {
    let newpost = req.body;
    let response = await addNewpost(newpost);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updatepostById(id, newpostData) {
  let postData = await post.findOne({ where: { id } });
  if (!postData) return {};
  postData.set(newpostData);

  let updatedpost = await postData.save();
  return { message: 'post updated successfully', updatedpost };
}

app.post('/posts/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newpostData = req.body;
    let response = await updatepostById(id, newpostData);
    if (!response.message) {
      return res.status(404).json({ message: 'post not found.' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function deletepostById(id) {
  let postData = await post.destroy({ where: { id } });
  if (!postData) return {};

  return { message: 'post deleted successfully' };
}

app.post('/posts/delete', async (req, res) => {
  try {
    let id = req.body.id;
    let response = await deletepostById(id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
  

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
