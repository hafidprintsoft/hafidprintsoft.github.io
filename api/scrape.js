const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware untuk static files
app.use(express.static(path.join(__dirname, 'public')));

// Tambahkan dukungan CORS
app.use(cors());

// Route untuk scraping
app.get('/scrape', async (req, res) => {
    const url = req.query.url;

    // Validasi URL
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }
    try {
        new URL(url); // Memastikan URL valid
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format.' });
    }

    try {
        // Ambil data dari URL
        const { data } = await axios.get(url);

        // Parsing HTML menggunakan Cheerio
        const $ = cheerio.load(data);

        // Cari meta og:video atau og:image
        let meta = $('meta[property="og:video"]').attr('content');
        if (!meta) {
            meta = $('meta[property="og:image"]').attr('content');
        }

        if (meta) {
            return res.status(200).json({ content: meta });
        } else {
            return res.status(404).json({ message: 'No og:image or og:video found' });
        }
    } catch (error) {
        console.error('Error scraping URL:', error.message);
        if (error.response) {
            // Error dari server tujuan
            return res.status(error.response.status).json({ error: error.response.statusText });
        }
        // Error lainnya (network, parsing, dll.)
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
