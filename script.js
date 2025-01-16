document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const fullData = document.getElementById("fullData");

    // Load the Excel file
    fetch("data.xlsx")
        .then((response) => response.arrayBuffer())
        .then((data) => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

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
        .catch((error) => console.error("Error loading Excel file:", error));

    // Display all data in the right panel
    function displayFullData(data) {
        fullData.innerHTML = data
            .map((row) => `<div>${row.join(" | ")}</div>`)
            .join("");
    }

    // Display search results in the left panel
    function displaySearchResults(data) {
        searchResults.innerHTML = data.length
            ? data.map((row) => `<div>${row.join(" | ")}</div>`).join("")
            : "<div>No results found</div>";
    }
});
