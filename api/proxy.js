const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Ambil URL dari query parameter
  const url = req.query.url;

  // Cek apakah URL ada dan valid
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Mengambil data dari URL eksternal
    const response = await fetch(url);
    
    // Mengecek jika permintaan gagal
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from external URL' });
    }

    // Mengambil data body dari response
    const data = await response.text();

    // Mengirimkan data kembali ke frontend
    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
