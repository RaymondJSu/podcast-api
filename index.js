const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for requests from your frontend
app.use(cors());

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI);

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

// Self-ping function to keep the service awake
const keepAlive = () => {
  const apiUrl = 'https://podcast-api-oxb4.onrender.com/api/episodes';
  setInterval(async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log(`Ping successful: ${response.status}`);
    } catch (error) {
      console.error('Error pinging API:', error);
    }
  }, 5 * 60 * 1000); // Ping every 5 minutes (5 * 60 * 1000 milliseconds)
};

// Start the server and call keepAlive after the server is running
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  keepAlive();  // Start self-pinging once the server is up
});
