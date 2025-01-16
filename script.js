document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const fullDataTable = document.getElementById("fullDataTable");
    const fullDataHeader = document.getElementById("fullDataHeader");
    const fullDataBody = document.getElementById("fullDataBody");

    let sheetData = []; // Store Excel data

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
            const sheetName = workbook.SheetNames[0];
            sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            // Display the full data in the table
            displayFullData(sheetData);

            // Add search functionality
            searchBar.addEventListener("input", () => {
                const query = searchBar.value.toLowerCase();
                const filteredData = sheetData.filter((row, index) =>
                    index === 0 || row.some((cell) => cell && cell.toString().toLowerCase().includes(query))
                );
                displaySearchResults(filteredData);
            });
        })
        .catch((error) => {
            console.error("Error loading or processing Excel file:", error);
        });

    // Function to display all data in the table
    function displayFullData(data) {
        const headers = data[0]; // Extract headers
        const rows = data.slice(1); // Extract rows

        // Create table header
        fullDataHeader.innerHTML = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;

        // Create table body
        fullDataBody.innerHTML = rows
            .map((row) => `<tr>${row.map((cell) => `<td>${cell || ""}</td>`).join("")}</tr>`)
            .join("");
    }

    // Function to display search results
    function displaySearchResults(data) {
        const headers = data[0]; // Extract headers
        const rows = data.slice(1); // Extract rows

        // Add checkboxes to rows
        searchResults.innerHTML = rows
            .map(
                (row, rowIndex) =>
                    `<div>
                        ${row
                            .map((cell, cellIndex) => `${headers[cellIndex]}: ${cell || ""}`)
                            .join(" | ")}
                        <input type="checkbox" data-index="${rowIndex}" />
                    </div>`
            )
            .join("");

        // Attach event listeners to checkboxes
        const checkboxes = searchResults.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((checkbox) =>
            checkbox.addEventListener("change", (e) => {
                const rowIndex = parseInt(e.target.dataset.index, 10) + 1; // Adjust for header row
                sheetData[rowIndex][sheetData[rowIndex].length - 1] = "Yes"; // Set last column to "Yes"
                updateExcelFile(); // Update the Excel file
            })
        );
    }

    // Function to update the Excel file
    function updateExcelFile() {
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "updated_data.xlsx");
    }
});
