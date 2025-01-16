document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const fullData = document.getElementById("fullData");

    console.log("DOM is fully loaded, script is running.");

    fetch("data.xlsx")
        .then((response) => response.arrayBuffer())
        .then((data) => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            displayFullData(sheetData);

            searchBar.addEventListener("input", () => {
                const query = searchBar.value.toLowerCase();
                const filteredData = sheetData.filter((row) =>
                    row.some((cell) => cell && cell.toString().toLowerCase().includes(query))
                );
                displaySearchResults(filteredData);
            });
        })
        .catch((error) => console.error("Error loading Excel file:", error));

    function displayFullData(data) {
        fullData.innerHTML = data
            .map((row) => `<div>${row.join(" | ")}</div>`)
            .join("");
    }

    function displaySearchResults(data) {
        searchResults.innerHTML = data.length
            ? data.map((row) => `<div>${row.join(" | ")}</div>`).join("")
            : "<div>No results found</div>";
    }
});
