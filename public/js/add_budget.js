/*
    Citation for the following functions:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app) Step 5 - Adding New Data
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addBudgetForm = document.getElementById('add-budget-form-ajax');

// Modify the objects we need
addBudgetForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBudgetAmount = document.getElementById("input-budgetAmount");
    let inputHourlyWage = document.getElementById("input-employeeWages-ajax");
    let inputMonthlyUpkeep = document.getElementById("input-habitatUpkeep-ajax");
    let inputTicketPrice = document.getElementById("input-admissionPrice-ajax");

    // Get the values from the form fields
    let budgetAmountValue = inputBudgetAmount.value;
    let hourlyWageValue = inputHourlyWage.value;
    let monthlyUpkeepValue = inputMonthlyUpkeep.value;
    let ticketPriceValue = inputTicketPrice.value;

    // Put our data we want to send in a javascript object
    let data = {
        budgetAmount: budgetAmountValue,
        hourlyWage: hourlyWageValue,
        monthlyUpkeep: monthlyUpkeepValue,
        ticketPrice: ticketPriceValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-budget-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBudgetAmount.value = '';
            inputHourlyWage.value = '';
            inputMonthlyUpkeep.value = '';
            inputTicketPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("budget-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let budgetIDCell = document.createElement("TD");
    let budgetAmountCell = document.createElement("TD");
    let hourlyWageCell = document.createElement("TD");
    let monthlyUpkeepCell = document.createElement("TD");
    let ticketPriceCell = document.createElement("TD");

    // Fill the cells with correct data
    budgetIDCell.innerText = newRow.budgetID;
    budgetAmountCell.innerText = newRow.budgetAmount;
    hourlyWageCell.innerText = newRow.hourlyWage;
    monthlyUpkeepCell.innerText = newRow.monthlyUpkeep;
    ticketPriceCell.innerText = newRow.ticketPrice;

    // Add the cells to the row 
    row.appendChild(budgetIDCell);
    row.appendChild(budgetAmountCell);
    row.appendChild(hourlyWageCell);
    row.appendChild(monthlyUpkeepCell);
    row.appendChild(ticketPriceCell);

    // Add the row to the table
    currentTable.appendChild(row);
}