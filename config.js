// Function to fetch data from the serverless API
function fetchDataAndInitialize() {
  fetch('/.netlify/functions/fetchData') // Serverless function URL
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Data fetched successfully:", data);

      // Populate the full table with all rows
      populateTable('fullData', data);

      // Set up search functionality
      setUpSearch(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please try again later.');
    });
}

// Function to populate a table with data
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

// Function to set up the search functionality
function setUpSearch(data) {
  const searchBar = document.getElementById('searchBar');
  searchBar.addEventListener('input', function () {
    const query = this.value.toLowerCase();

    // Filter rows based on the search query
    const filteredData = data.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(query)
      )
    );

    // Populate the search results table
    populateTable('searchResults', filteredData);
  });
}

// Initialize the app
fetchDataAndInitialize();
