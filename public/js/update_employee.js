/*
    Citation for the following functions:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app) Step 8 - Dynamically Updating Data
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
*/
// Get the objects we need to modify
let updateEmployeeForm = document.getElementById('update-employee-form-ajax');

// Modify the objects we need
updateEmployeeForm.addEventListener("Submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-firstName");
    let inputLastName = document.getElementById("input-lastName");
    let inputPhoneNum = document.getElementById("input-phoneNum");
    let inputHourlyWage = document.getElementById("input-hourlyWage");
    let inputWorkEmail = document.getElementById("input-workEmail");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value
    let lastNameValue = inputLastName.value;
    let phoneNumValue = inputPhoneNum.value
    let hourlyWageValue = inputHourlyWage.value
    let workEmailValue = inputWorkEmail.Value


    if (isNaN(phoneNumValue, hourlyWageValue)) {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        firstName:  firstNameValue,
        lastName:   lastNameValue,
        phoneNum:   phoneNumValue,
        hourlyWage: hourlyWageValue,
        workEmail:  workEmailValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, firstNameValue);
            updateRow(xhttp.response, lastNameValue);
            updateRow(xhttp.response, phoneNumValue);
            updateRow(xhttp.response, hourlyWageValue);
            updateRow(xhttp.response, workEmailValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, employeeID) {
    console.log(data)
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("employee-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == employeeID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name;
        }
    }
}
