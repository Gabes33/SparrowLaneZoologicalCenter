/*
    Citation for the following functions:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app) Step 5 - Adding New Data
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

// Get the objects we need to modify
let addAdmissionForm = document.getElementById('createAdmissions');

// Modify the objects we need
addAdmissionForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAdmissionTotal = document.getElementById("input-admissionTotal");
    let inputTicketPrice = document.getElementById("input-ticketPrice");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let admissionTotalValue = inputAdmissionTotal.value;
    let ticketPriceValue = inputTicketPrice.value;
    let descriptionValue = inputDescription.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        admissionTotal: admissionTotalValue,
        ticketPrice: ticketPriceValue,
        description: descriptionValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-admission-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAdmissionTotal.value = '';
            inputTicketPrice.value = '';
            inputDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Admissions
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("admissions-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let admissionTotalCell = document.createElement("TD");
    let ticketPriceCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.admissionID;
    admissionTotalCell.innerText = newRow.admissionTotal;
    ticketPriceCell.innerText = newRow.ticketPrice;
    descriptionCell.innerText = newRow.description;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(admissionTotalCell);
    row.appendChild(ticketPriceCell);
    row.appendChild(descriptionCell);

    // Add the row to the table
    currentTable.appendChild(row);
};
