const GITHUB_TOKEN = "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";
const REPO_OWNER = "Que6tion";
const REPO_NAME = "Dangiskadiena";
const FILE_PATH = "data.xlsx";
let workbook, worksheet, headers, rows, sha;

// Load Excel File
document.getElementById("loadFile").addEventListener("click", async () => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const response = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });
    const data = await response.json();
    sha = data.sha;

    // Decode and parse the Excel file
    const fileContent = atob(data.content);
    const arrayBuffer = new Uint8Array(fileContent.split("").map(char => char.charCodeAt(0)));
    workbook = XLSX.read(arrayBuffer, { type: "array" });
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    headers = jsonData[0];
    rows = jsonData.slice(1);

    renderTable();
});

// Render Table
function renderTable() {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.querySelector("#resultTable tbody");
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    // Add headers
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHeader.appendChild(th);
    });
    const actionTh = document.createElement("th");
    actionTh.textContent = "Mark";
    tableHeader.appendChild(actionTh);

    // Add rows
    rows.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });

        const actionTd = document.createElement("td");
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.addEventListener("change", () => markRow(rowIndex, checkBox.checked));
        actionTd.appendChild(checkBox);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });
}

// Mark Row
async function markRow(rowIndex, isChecked) {
    rows[rowIndex].push(isChecked ? "TRUE" : "FALSE");

    // Create updated worksheet
    const updatedData = [headers, ...rows];
    const newWorksheet = XLSX.utils.aoa_to_sheet(updatedData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

    const fileContent = XLSX.write(newWorkbook, { bookType: "xlsx", type: "base64" });

    // Push updated file to GitHub
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
        body: JSON.stringify({
            message: `Update row ${rowIndex + 1}`,
            content: fileContent,
            sha: sha,
        }),
    });

    if (response.ok) {
        alert(`Row ${rowIndex + 1} updated successfully!`);
    } else {
        alert("Failed to update the file. Please try again.");
    }
}
