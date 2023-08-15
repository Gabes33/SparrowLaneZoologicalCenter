/*
    Citation for the following functions:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app) Step 5 - Adding New Data
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addFoodSuppliesForm = document.getElementById('add-food-form-ajax');

// Modify the objects we need
addFoodSuppliesForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputItemName = document.getElementById("input-itemName");
    let inputQuantity = document.getElementById("input-quantity");
    let inputPrice = document.getElementById("input-price");

    // Get the values from the form fields
    let itemNameValue = inputItemName.value;
    let quantityValue = inputQuantity.value;
    let priceValue = inputPrice.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        itemName: itemNameValue,
        quantity: quantityValue,
        price: priceValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-food-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToFoodTable(xhttp.response);

            // Clear the input fields for another transaction
            inputItemName.value = '';
            inputQuantity.value = '';
            inputPrice.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from species
function addRowToFoodTable(data) {
    // Get a reference to the current table on the page
    let currentTable = document.getElementById("foodsupplies-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let newRow = JSON.parse(data)[JSON.parse(data).length - 1];

    // Create a row and cells
    let row = document.createElement("tr");
    let itemIDCell = document.createElement("td");
    let itemNameCell = document.createElement("td");
    let quantityCell = document.createElement("td");
    let priceCell = document.createElement("td");

    // Fill the cells with correct data
    itemIDCell.innerText = newRow.itemID;
    itemNameCell.innerText = newRow.itemName;
    quantityCell.innerText = newRow.quantity;
    priceCell.innerText = newRow.price;

    // Add the cells to the row
    row.appendChild(itemIDCell);
    row.appendChild(itemNameCell);
    row.appendChild(quantityCell);
    row.appendChild(priceCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
