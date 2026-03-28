const express = require('express');
const app = express();
let { company } = require('./models/company.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

let companies = [
  {
    id: 1,
    name: 'Tech Innovators',
    industry: 'Technology',
    foundedYear: 2010,
    headquarters: 'San Francisco',
    revenue: 75000000,
  },
  {
    id: 2,
    name: 'Green Earth',
    industry: 'Renewable Energy',
    foundedYear: 2015,
    headquarters: 'Portland',
    revenue: 50000000,
  },
  {
    id: 3,
    name: 'Innovatech',
    industry: 'Technology',
    foundedYear: 2012,
    headquarters: 'Los Angeles',
    revenue: 65000000,
  },
  {
    id: 4,
    name: 'Solar Solutions',
    industry: 'Renewable Energy',
    foundedYear: 2015,
    headquarters: 'Austin',
    revenue: 60000000,
  },
  {
    id: 5,
    name: 'HealthFirst',
    industry: 'Healthcare',
    foundedYear: 2008,
    headquarters: 'New York',
    revenue: 80000000,
  },
  {
    id: 6,
    name: 'EcoPower',
    industry: 'Renewable Energy',
    foundedYear: 2018,
    headquarters: 'Seattle',
    revenue: 55000000,
  },
  {
    id: 7,
    name: 'MediCare',
    industry: 'Healthcare',
    foundedYear: 2012,
    headquarters: 'Boston',
    revenue: 70000000,
  },
  {
    id: 8,
    name: 'NextGen Tech',
    industry: 'Technology',
    foundedYear: 2018,
    headquarters: 'Chicago',
    revenue: 72000000,
  },
  {
    id: 9,
    name: 'LifeWell',
    industry: 'Healthcare',
    foundedYear: 2010,
    headquarters: 'Houston',
    revenue: 75000000,
  },
  {
    id: 10,
    name: 'CleanTech',
    industry: 'Renewable Energy',
    foundedYear: 2008,
    headquarters: 'Denver',
    revenue: 62000000,
  },
];
app.use(express.json())

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await company.bulkCreate(companies);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllcompanies() {
  let companies = await company.findAll();
  return { companies: companies };
}
app.get('/companies', async (req, res) => {
  try {
    let response = await fetchAllcompanies();
    if (response.companies === null) {
      return res.status(404).json({ message: 'No Company found. ' });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewcompany(newCompany) {
  let companyData = await company.create(newCompany);
  return { companyData };
}

app.post('/Companies/new', async (req, res) => {
  try {
    let newCompany = req.body;
    let response = await addNewcompany(newCompany);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function updateCompanyById(id, newCompanyData) {
  let companyData = await company.findOne({ where: { id } });
  if (!companyData) return {};
  companyData.set(newCompanyData);

  let updatedCompany = await companyData.save();
  return { message: 'Company updated successfully', updatedCompany };
}

app.post('/companies/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newCompanyData = req.body;
    let response = await updateCompanyById(id, newCompanyData);
    if (!response.message) {
      return res.status(404).json({ message: 'Company not found.' });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function deleteCompanyById(id) {
  let companyData = await company.destroy({ where: { id } });
  if (!companyData) return {};

  return { message: 'Company deleted successfully' };
}

app.post('/companies/delete', async (req, res) => {
  try {
    let id = req.body.id;
    let response = await deleteCompanyById(id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
