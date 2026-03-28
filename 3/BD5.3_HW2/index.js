const express = require('express');
const app = express();
let { employee } = require('./models/employee.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

let employees = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Manager',
    department: 'Sales',
    salary: 90000,
  },
  {
    id: 2,
    name: 'Anna Brown',
    designation: 'Developer',
    department: 'Engineering',
    salary: 80000,
  },
  {
    id: 3,
    name: 'James Smith',
    designation: 'Designer',
    department: 'Marketing',
    salary: 70000,
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'HR Specialist',
    department: 'Human Resources',
    salary: 60000,
  },
  {
    id: 5,
    name: 'Michael Wilson',
    designation: 'Developer',
    department: 'Engineering',
    salary: 85000,
  },
  {
    id: 6,
    name: 'Sarah Johnson',
    designation: 'Data Analyst',
    department: 'Data Science',
    salary: 75000,
  },
  {
    id: 7,
    name: 'David Lee',
    designation: 'QA Engineer',
    department: 'Quality Assurance',
    salary: 70000,
  },
  {
    id: 8,
    name: 'Linda Martinez',
    designation: 'Office Manager',
    department: 'Administration',
    salary: 50000,
  },
  {
    id: 9,
    name: 'Robert Hernandez',
    designation: 'Product Manager',
    department: 'Product',
    salary: 95000,
  },
  {
    id: 10,
    name: 'Karen Clark',
    designation: 'Sales Associate',
    department: 'Sales',
    salary: 55000,
  },
];

app.use(express.json());

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await employee.bulkCreate(employees);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllemployees() {
  let employees = await employee.findAll();
  return { employees: employees };
}
app.get('/employees', async (req, res) => {
  try {
    let response = await fetchAllemployees();
    if (response.employees === null) {
      return res.status(404).json({ message: 'No employee found. ' });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewemployee(newemployee) {
  let employeeData = await employee.create(newemployee);
  return { employeeData };
}

app.post('/employees/new', async (req, res) => {
  try {
    let newemployee = req.body;
    let response = await addNewemployee(newemployee);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updateemployeeById(id, newemployeeData) {
  let employeeData = await employee.findOne({ where: { id } });
  if (!employeeData) return {};
  employeeData.set(newemployeeData);

  let updatedemployee = await employeeData.save();
  return { message: 'employee updated successfully', updatedemployee };
}

app.post('/employees/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newemployeeData = req.body;
    let response = await updateemployeeById(id, newemployeeData);
    if (!response.message) {
      return res.status(404).json({ message: 'employee not found.' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function deleteemployeeById(id) {
  let employeeData = await employee.destroy({ where: { id } });
  if (!employeeData) return {};

  return { message: 'employee deleted successfully' };
}

app.post('/employees/delete', async (req, res) => {
  try {
    let id = req.body.id;
    let response = await deleteemployeeById(id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
