const fs = require('fs');

function convertToJSON(tabularData) {
  const rows = tabularData.split('\n').map(row => row.trim()).filter(Boolean);

  // Extract headers
  const headers = rows[1].split('│').map(header => header.trim()).filter(Boolean);

  // Extract data rows
  const dataRows = rows.slice(3, -1);

  // Parse each data row
  const jsonData = dataRows.map(dataRow => {
    const rowData = dataRow.split('│').map(entry => entry.trim()).filter(Boolean);
    return headers.reduce((acc, header, index) => {
      acc[header] = rowData[index];
      return acc;
    }, {});
  });

  return jsonData;
}

try {
  const tabularData = fs.readFileSync('prem.txt', 'utf8');
  const jsonData = convertToJSON(tabularData);
  fs.writeFileSync('prem.txt', JSON.stringify(jsonData, null, 2));
  console.log('Conversion successful. JSON data has been written to prem.txt');
} catch (error) {
  console.error('Error converting data:', error);
}
