const express = require('express');
const app = express();
let { course } = require('./models/course.model');
let { student } = require('./models/student.model');
let { studentCourse } = require('./models/studentCourse.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

app.use(express.json());

let courses = [
  { title: 'Math 101', description: 'Basic Mathematics' },
  { title: 'History 201', description: 'World History' },
  { title: 'Science 301', description: 'Basic Sciences' },
];

let students = [{ name: 'John Doe', age: 24 }];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await course.bulkCreate(courses);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewStudent(newStudent) {
  let studentData = await student.create(newStudent);
  return { studentData };
}

app.post('/students/new', async (req, res) => {
  try {
    let newStudent = req.body.newStudent;
    let response = await addNewStudent(newStudent);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updateStudentById(id, newStudentData) {
  let studentDetails = await student.findOne({ where: { id } });
  if (!studentDetails) {
    return {};
  }
  studentDetails.set(newStudentData);
  let updatedStudent = await studentDetails.save();

  return { message: 'Student updated successfully', updatedStudent };
}

app.post('/students/update/:id', async (req, res) => {
  try {
    let newStudentData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateStudentById(id, newStudentData);

    if (!response.message) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
