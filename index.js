const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
