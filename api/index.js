const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ඔයාගේ MongoDB Connection String එක මෙන්න මෙතැනට දාලා තියෙන්නේ[span_2](start_span)[span_2](end_span)
const MONGO_URI = "mongodb+srv://gimahandasun_db_user:wBQRsaPleVoFEXSK@cluster0.k2jdqob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Database Connected Successfully!"))
  .catch(err => console.log("DB Connection Error: ", err));

const subSchema = new mongoose.Schema({
    title: String,
    episode: String,
    directLink: String,
    telegramLink: String,
    date: { type: Date, default: Date.now }
});

const Subtitle = mongoose.model('Subtitle', subSchema);

// සියලුම සබ් ලබා ගැනීමට (Main Site එකට)
app.get('/api/subtitles', async (req, res) => {
    try {
        const subs = await Subtitle.find().sort({ date: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// අලුත් සබ් එකක් ඇඩ් කිරීමට (Admin Panel එකට)
app.get('/api/add', async (req, res) => {
    try {
        const { title, episode, directLink, telegramLink } = req.query;
        const newSub = new Subtitle({ title, episode, directLink, telegramLink });
        await newSub.save();
        res.json({ message: "Subtitle Added Successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
