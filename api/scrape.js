const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const port = 3000;

// Static file middleware to serve HTML
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk scraping dan mendapatkan meta content
app.get('/scrape', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        // Ambil HTML dari URL menggunakan axios
        const { data } = await axios.get(url);

        // Gunakan cheerio untuk parsing HTML
        const $ = cheerio.load(data);

        // Cari meta tag og:video atau og:image
        let meta = $('meta[property="og:video"]').attr('content');
        if (!meta) {
            meta = $('meta[property="og:image"]').attr('content');
        }

        if (meta) {
            res.json({ content: meta });
        } else {
            res.json({ message: 'No og:image or og:video found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error scraping the URL.');
    }
});

// Mulai server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
