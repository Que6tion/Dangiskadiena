// Load and parse the XLSX file
fetch('data/yourfile.xlsx') // Replace with your XLSX file path
  .then(response => response.arrayBuffer())
  .then(data => {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

    // Populate the full table
    populateTable('fullData', jsonData);

    // Add search functionality
    document.getElementById('searchBar').addEventListener('input', function () {
      const query = this.value.toLowerCase();
      const filteredData = jsonData.filter(row =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(query)
        )
      );
      populateTable('searchResults', filteredData);
    });
  });

// Populate a table with data
function populateTable(tableId, data) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  // Clear the table
  thead.innerHTML = '';
  tbody.innerHTML = '';

  // Populate headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
  }

  // Populate rows
  data.forEach(row => {
    const tr = document.createElement('tr');
    Object.values(row).forEach(cellValue => {
      const td = document.createElement('td');
      td.textContent = cellValue;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
