const express = require('express');
const app = express();
let { track } = require('./models/track.model');
let { sequelize } = require('./lib/index');
let PORT = process.env.PORT || 3000;

app.use(express.json());
let tracks = [
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: 4,
  },
  {
    name: 'Naina Da Kya Kasoor',
    genre: 'Pop',
    release_year: 2018,
    artist: 'Amit Trivedi',
    album: 'Andhadhun',
    duration: 3,
  },
  {
    name: 'Ghoomar',
    genre: 'Traditional',
    release_year: 2018,
    artist: 'Shreya Ghoshal',
    album: 'Padmaavat',
    duration: 3,
  },
  {
    name: 'Bekhayali',
    genre: 'Rock',
    release_year: 2019,
    artist: 'Sachet Tandon',
    album: 'Kabir Singh',
    duration: 6,
  },
  {
    name: 'Hawa Banke',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Darshan Raval',
    album: 'Hawa Banke (Single)',
    duration: 3,
  },
  {
    name: 'Ghungroo',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'War',
    duration: 5,
  },
  {
    name: 'Makhna',
    genre: 'Hip-Hop',
    release_year: 2019,
    artist: 'Tanishk Bagchi',
    album: 'Drive',
    duration: 3,
  },
  {
    name: 'Tera Ban Jaunga',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Tulsi Kumar',
    album: 'Kabir Singh',
    duration: 3,
  },
  {
    name: 'First Class',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 4,
  },
  {
    name: 'Kalank Title Track',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 5,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await track.bulkCreate(tracks);

    res.status(200).json({ message: 'Database seeding is successfull' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllTracks() {
  let tracks = await track.findAll();
  return { tracks: tracks };
}
app.get('/tracks', async (req, res) => {
  try {
    let response = await fetchAllTracks();
    if (response.tracks === null) {
      return res.status(404).json({ message: 'No company found. ' });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewTrack(newTrack) {
  let trackData = await track.create(newTrack);
  return { trackData };
}

app.post('/tracks/new', async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let response = await addNewTrack(newTrack);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function updateTrackById (id, newTrackData) {
  let trackData = await track.findOne({where: {id}});
  if(!trackData) return {}
  trackData.set(newTrackData);

  let updatedTrack = await trackData.save();
  return {message: "Track updated successfully", updatedTrack };
}

app.post('/tracks/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newTrackData = req.body;
    let response = await updateTrackById (id, newTrackData);
    if (!response.message) {
      return res.status(404).json({ message: "Track not found."});
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function deleteTrackById(id) {
  let trackData = await track.destroy({where: {id}});
  if(!trackData) return {}

  return {message: "Track deleted successfully"};
}

app.post('/tracks/delete', async (req, res) => {
  try {
    
    let id = req.body.id;
    let response = await deleteTrackById(id);
    
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
