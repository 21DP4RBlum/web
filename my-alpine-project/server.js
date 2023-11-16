const express = require('express');
const { execSync } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.get('/premier-league-data', (req, res) => {
  try {
    const premierLeagueOutput = execSync('npx the-premier-league', { encoding: 'utf-8' });
    res.json({ data: premierLeagueOutput });
  } catch (error) {
    console.error('Error fetching Premier League data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
