const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Use the environment variable set in Render for the API key
const CMC_API_KEY = process.env.X_CMC_PRO_API_KEY;

app.use(cors());

app.get('/price', async (req, res) => {
  try {
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC&convert=USD',
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        }
      }
    );
    const data = await response.json();
    const price = data.data.BTC[0].quote.USD.price;
    res.json({ price });
  } catch (err) {
    console.error("Error fetching price:", err);
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});