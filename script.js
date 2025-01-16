document.addEventListener("DOMContentLoaded", () => {
    // Safely retrieve elements from the DOM
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const fullData = document.getElementById("fullData");

    // Check if the elements exist
    if (!searchBar || !searchResults || !fullData) {
        console.error("One or more DOM elements are missing!");
        return;
    }

    // Fetch and parse the Excel file
    fetch("data.xlsx")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then((data) => {
            // Parse the Excel file using SheetJS
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet name
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }); // Convert to JSON

            // Display the full data in the right panel
            displayFullData(sheetData);

            // Add search functionality
            searchBar.addEventListener("input", () => {
                const query = searchBar.value.toLowerCase();
                const filteredData = sheetData.filter((row) =>
                    row.some((cell) => cell && cell.toString().toLowerCase().includes(query))
                );
                displaySearchResults(filteredData);
            });
        })
        .catch((error) => {
            console.error("Error loading or processing Excel file:", error);
            fullData.innerHTML = `<div class="error">Unable to load data.xlsx. Please check the file.</div>`;
        });

    // Function to display all data in the right panel
    function displayFullData(data) {
        fullData.innerHTML = data
            .map((row) => `<div>${row.join(" | ")}</div>`)
            .join("");
    }

    // Function to display search results in the left panel
    function displaySearchResults(data) {
        searchResults.innerHTML = data.length
            ? data.map((row) => `<div>${row.join(" | ")}</div>`).join("")
            : "<div>No results found</div>";
    }
});
