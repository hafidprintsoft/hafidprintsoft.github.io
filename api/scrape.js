import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Utilitas untuk mendapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware untuk static files
app.use(express.static(path.join(__dirname, 'public')));

// Tambahkan dukungan CORS
app.use(cors());

// Route untuk scraping
app.get('/api/scrape', async (req, res) => {
    console.log('Scraping request received');
    const url = req.query.url;

    // Validasi URL
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }
    try {
        new URL(url); 
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format.' });
    }

    try {
        // Ambil data dari URL
        const { data } = await axios.get(url);

        // Parsing HTML menggunakan Cheerio
        const $ = cheerio.load(data);

        var typeMeta = 'video';

        // Cari meta og:video atau og:image
        let meta = $('meta[property="og:video"]').attr('content');
        if (!meta) {
            meta = $('meta[property="og:image"]').attr('content');
            typeMeta = 'image';
        }

        if (meta) {
            return res.status(200).json({ status: 'sip', type: typeMeta, content: meta });
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

// Ekspor default untuk mendukung runtime serverless seperti Vercel
export default app;

// Jalankan server (opsional, untuk pengujian lokal)
if (process.env.NODE_ENV !== 'production') {
    // const port = 2001;
    // app.listen(port, () => {
    //     console.log(`Server running at http://localhost:${port}`);
    // });
}
