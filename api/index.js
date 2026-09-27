const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS හැඩගැස්වීම (සියලුම ඩොමේන් සඳහා අවසර ලබා දීම)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// OPTIONS සඳහා විශේෂයෙන් ප්‍රතිචාර දැක්වීම
app.options('*', cors());

const MONGO_URI = "mongodb+srv://gimahandasun_db_user:wBQRsaPleVoFEXSK@cluster0.k2jdqob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("DB Connected!"))
  .catch(err => console.log(err));

const subSchema = new mongoose.Schema({
    title: String,
    episode: String,
    directLink: String,
    telegramLink: String,
    date: { type: Date, default: Date.now }
});
const Subtitle = mongoose.model('Subtitle', subSchema);

// සබ්ස් ඇඩ් කිරීමට (POST)
app.post('/api/add', async (req, res) => {
    try {
        const { title, episode, directLink, telegramLink } = req.body;
        const newSub = new Subtitle({ title, episode, directLink, telegramLink });
        await newSub.save();
        res.json({ message: "Added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// සබ්ස් ලැයිස්තුව ලබා ගැනීමට (GET)
app.get('/api/subtitles', async (req, res) => {
    try {
        const subs = await Subtitle.find().sort({ _id: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
