/*
    Citation for the following functions:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app) Step 5 - Adding New Data
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/
// Get the objects we need to modify
let addSpeciesForm = document.getElementById('addSpecies');

// Modify the objects we need
addSpeciesForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSpeciesName = document.getElementById("input-speciesName");
    let inputSpeciesDescription = document.getElementById("input-speciesDescription");

    // Get the values from the form fields
    let speciesNameValue = inputSpeciesName.value;
    let speciesDescriptionValue = inputSpeciesDescription.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        speciesName: speciesNameValue,
        description: speciesDescriptionValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-species-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToSpeciesTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSpeciesName.value = '';
            inputSpeciesDescription.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from species
function addRowToSpeciesTable(data) {
    // Get a reference to the current table on the page
    let currentTable = document.getElementById("species-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let newRow = JSON.parse(data)[JSON.parse(data).length - 1];

    // Create a row and cells
    let row = document.createElement("tr");
    let speciesIDCell = document.createElement("td");
    let speciesNameCell = document.createElement("td");
    let descriptionCell = document.createElement("td");

    // Fill the cells with correct data
    speciesIDCell.innerText = newRow.speciesID;
    speciesNameCell.innerText = newRow.speciesName;
    descriptionCell.innerText = newRow.description;

    // Add the cells to the row
    row.appendChild(speciesIDCell);
    row.appendChild(speciesNameCell);
    row.appendChild(descriptionCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
