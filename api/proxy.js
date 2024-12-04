const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const url = req.query.url; // URL yang diterima dari query parameter

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.status(200).send(data); // Mengirimkan data dari API eksternal
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
