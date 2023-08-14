/*
    Citation for the following functions:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app) Step 5 - Adding New Data
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/
let addAnimalForm = document.getElementById('add-animal-form-ajax');

// Modify the objects we need
addAnimalForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAnimalName = document.getElementById("input-animalName");
    let inputDescription = document.getElementById("input-description");
    let inputSpeciesName = document.getElementById("input-species");
    let inputHabitatDescription = document.getElementById("input-habitat");

    // Get the values from the form fields
    let animalNameValue = inputAnimalName.value;
    let descriptionValue = inputDescription.value;
    let speciesNameValue = inputSpeciesName.value;
    let habitatDescriptionValue = inputHabitatDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        animalName: animalNameValue,
        description: descriptionValue,
        speciesName: speciesNameValue,
        habitatDescription: habitatDescriptionValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-animal-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAnimalName.value = '';
            inputDescription.value = '';
            inputSpeciesName.value = '';
            inputHabitatDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("animals-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let animalIDCell = document.createElement("TD");
    let animalNameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let homeworldCell = document.createElement("TD");
    let ageCell = document.createElement("TD");

    // Fill the cells with correct data
    animalIDCell.innerText = newRow.id;
    animalNameCell.innerText = newRow.fname;
    descriptionCell.innerText = newRow.description;
    speciesNameCell.innerText = newRow.speciesName;
    habitatDescriptionCell.innerText = newRow.habitatDescription;

    // Add the cells to the row 
    row.appendChild(animalIDCell);
    row.appendChild(animalNameCell);
    row.appendChild(descriptionCell);
    row.appendChild(speciesNameCell);
    row.appendChild(habitatDescriptionCell);

    // Add the row to the table
    currentTable.appendChild(row);
}