const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

function parsePremierLeagueData(rawData) {
  console.log('Raw Data:', rawData);

  const rows = rawData.split('\n');

  // Extract column headers
  const headers = rows[0].split('│').map(header => header.trim()).filter(Boolean);

  // Extract data rows
  const dataRows = rows.slice(2, -2);

  // Parse each data row
  const parsedData = dataRows.map(dataRow => {
    const rowData = dataRow.split('│').map(entry => entry.trim()).filter(Boolean);
    return headers.reduce((acc, header, index) => {
      acc[header] = rowData[index];
      return acc;
    }, {});
  });

  console.log('Headers:', headers);
  console.log('Parsed Data:', parsedData);

  return parsedData;
}

function generateHTML(data) {
  return `
    <html>
      <head>
        <style>
          /* Add your styling here if needed */
        </style>
      </head>
      <body>
        <table>
          <tr>
            <th>Rank</th>
            <th>Club</th>
            <th>P</th>
            <th>PTS</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>RF</th>
          </tr>
          ${data.map((club, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${club['Club']}</td>
              <td>${club['P']}</td>
              <td>${club['PTS']}</td>
              <td>${club['W']}</td>
              <td>${club['D']}</td>
              <td>${club['L']}</td>
              <td>${club['GF']}</td>
              <td>${club['RF']}</td>
            </tr>`).join('')}
        </table>
      </body>
    </html>
  `;
}

app.get('/premier-league-data', (req, res) => {
  try {
    const rawData = fs.readFileSync('prem.json', 'utf8');
    const parsedData = parsePremierLeagueData(rawData);
    const html = generateHTML(parsedData);
    res.send(html);
  } catch (error) {
    console.error('Error reading Premier League data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
