const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');

// Enable CORS for requests from your frontend
app.use(cors());

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI);
const url = `https://podcast-api-oxb4.onrender.com/api/episodes`;
const interval = 300000; // Interval in milliseconds (30 seconds)

app.get('/api/episodes', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('podcast_summarizer');
    const episodes = await db.collection('episodes').find().sort({ timestamp: -1 }).toArray();
    res.json(episodes);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);
