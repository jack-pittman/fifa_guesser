export const cols = [1, 5, 6, 8, 7, 12, 17, 21, 22, 27, 32, 33, 40, 41, 42, 43, 44, 45, 46];

export function csvToArray(columnsToInclude = cols) {
    console.log("Loading CSV file!");

    return fetch('../data/players.csv')  // Replace '/data/players.csv' with the path to your CSV file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Helper function to split CSV row
            function splitCsvRow(row) {
                // Replace escaped commas with a placeholder
                row = row.replace(/\\,/g, 'ESCAPED_COMMA_PLACEHOLDER');

                // Split the row into columns considering quotes
                const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
                let columns = row.split(regex);

                // Restore the escaped commas
                columns = columns.map(column => column.replace(/ESCAPED_COMMA_PLACEHOLDER/g, ','));

                return columns;
            }

            // Split the CSV data into rows
            const rows = data.split('\n');

            // Process rows to extract data
            const players = rows.map(row => {
                const columns = splitCsvRow(row); // Use the custom split function
                return columnsToInclude.map(index => columns[index] || ""); // Extract columns based on indices
            }).filter(row => row.length === columnsToInclude.length); // Filter out rows that do not have all specified columns

            console.log("Players Data:", players);

            return players; // Return the players array
        })
        .catch(error => {
            console.error('Fetch error:', error);
            return []; // Return an empty array in case of an error
        });
}

function splitCsvRow(row) {
    // Regular expression to match commas not preceded by a backslash
    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;

    // Replace escaped commas with a placeholder
    row = row.replace(/\\,/g, 'ESCAPED_COMMA_PLACEHOLDER');

    // Split the row into columns
    let columns = row.split(regex);

    // Replace placeholder with actual commas
    columns = columns.map(column => column.replace(/ESCAPED_COMMA_PLACEHOLDER/g, ','));

    return columns;
}