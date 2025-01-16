document.addEventListener("DOMContentLoaded", () => {
    const GITHUB_TOKEN = "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"; // Replace with your GitHub token
    const REPO_OWNER = "Que6tion"; // Replace with your GitHub username
    const REPO_NAME = "Dangiskadiena"; // Replace with your repository name
    const FILE_PATH = "data.xlsx"; // Path to the file in your repository
    const BRANCH = "main"; // Branch name

    const searchBar = document.getElementById("searchBar");
    const searchResultsHeader = document.getElementById("searchResultsHeader");
    const searchResultsBody = document.getElementById("searchResultsBody");
    const fullDataHeader = document.getElementById("fullDataHeader");
    const fullDataBody = document.getElementById("fullDataBody");

    let sheetData = []; // Store Excel data

    // Fetch the file content from GitHub
    fetchFromGitHub()
        .then((dataBuffer) => {
            const workbook = XLSX.read(dataBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            displayFullData(sheetData);

            searchBar.addEventListener("input", () => {
                const query = searchBar.value.toLowerCase();
                const filteredData = sheetData.filter((row, index) =>
                    index === 0 || row.some((cell) => cell && cell.toString().toLowerCase().includes(query))
                );
                displaySearchResults(filteredData);
            });
        })
        .catch((error) => console.error("Error loading or processing Excel file:", error));

    function displayFullData(data) {
        const headers = data[0];
        const rows = data.slice(1);

        fullDataHeader.innerHTML = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;
        fullDataBody.innerHTML = rows
            .map((row) => `<tr>${row.map((cell) => `<td>${cell || ""}</td>`).join("")}</tr>`)
            .join("");
    }

    function displaySearchResults(data) {
        const headers = data[0];
        const rows = data.slice(1);

        searchResultsHeader.innerHTML = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;
        searchResultsBody.innerHTML = rows
            .map(
                (row, rowIndex) =>
                    `<tr>
                        ${row.map((cell) => `<td>${cell || ""}</td>`).join("")}
                        <td><input type="checkbox" data-index="${rowIndex}" /></td>
                    </tr>`
            )
            .join("");

        const checkboxes = searchResultsBody.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((checkbox) =>
            checkbox.addEventListener("change", (e) => {
                const rowIndex = parseInt(e.target.dataset.index, 10) + 1;
                sheetData[rowIndex][sheetData[rowIndex].length - 1] = "Yes";
                updateGitHubFile();
            })
        );
    }

    async function fetchFromGitHub() {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const fileData = await response.json();
        return fetch(fileData.download_url).then((res) => res.arrayBuffer());
    }

    async function updateGitHubFile() {
        const workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");

        const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

        const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const fileResponse = await fetch(fileUrl, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
        });

        if (!fileResponse.ok) {
            throw new Error(`GitHub API error: ${fileResponse.statusText}`);
        }

        const fileInfo = await fileResponse.json();

        const updateResponse = await fetch(fileUrl, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Update Excel file via web app",
                content: excelFile,
                sha: fileInfo.sha,
                branch: BRANCH,
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update file: ${updateResponse.statusText}`);
        }

        console.log("File updated successfully on GitHub!");
    }
});
