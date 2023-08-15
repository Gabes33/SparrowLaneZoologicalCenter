/*
    Citation for the following source code:
    Date: 08/05/2023
    Adapted from the code in the following GitHub repository (nodejs-starter-app)
    Source URL - https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
*/

//-------------------------------------------------------------------------------------------------
// SETUP
//-------------------------------------------------------------------------------------------------
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 9448                // Set a port number at the top so it's easy to change in the future

// app.js

// Database
var db = require('./database/db-connector')


// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


//-------------------------------------------------------------------------------------------------
// GET
//-----------------------------------------------------------------------------------------------
///// Display home page
app.get('/index.hbs', function (req, res) {
    res.render('index.hbs');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});                                         // will process this file, before sending the finished HTML to the client.



///// Display and Search Employee page
app.get('/employees.hbs', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.lastName === undefined) {
        query1 = "SELECT * FROM Employees;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Employees WHERE lastName LIKE "${req.query.lastName}%"`
    }
    let query2 = "SELECT employeeID FROM Employees;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {

        // Save the people
        let employees = rows;

        db.pool.query(query2, function (error, rows, fields) {
            // Save the employee IDs
            let employeeIDs = rows.map(row => row.employeeID);

            return res.render('employees.hbs', { data: employees, employeeIDs: employeeIDs });
        });
    });
});
/////// Admissions
app.get('/admissions.hbs', function (req, res) {

    let query1;


    if (req.query.admissionID === undefined) {
        query1 = "SELECT * FROM Admissions;";
    }


    else {
        query1 = `SELECT * FROM Admissions WHERE admissionID LIKE "${req.query.admissionID}%"`
    }



    db.pool.query(query1, function (error, rows, fields) {


        let admission = rows;


        return res.render('admissions', { data: admission });
    })
});

/////// Species
app.get('/species.hbs', function (req, res) {

    let query1;

    if (req.query.speciesName === undefined) {
        query1 = "SELECT * FROM Species;";
    }

    else {
        query1 = `SELECT * FROM Species WHERE speciesName LIKE "${req.query.speciesName}%"`
    }

    db.pool.query(query1, function (error, rows, fields) {

        let species = rows;

        return res.render('species.hbs', { data: species });
    })
})
    ;

////// Display Animals

app.get('/animals.hbs', function (req, res) {
    // Declare Query
    let query;

    if (req.query.animalName === undefined) {
        query = `
        SELECT Animals.*, Species.speciesName, Habitat_enclosures.description AS habitatDescription
        FROM Animals
        JOIN Species ON Animals.speciesID = Species.speciesID
        JOIN Habitat_enclosures ON Animals.habitatID = Habitat_enclosures.habitatID;
        `;
    } else {
        query = `
        SELECT Animals.*, Species.speciesName, Habitat_enclosures.description AS habitatDescription
        FROM Animals
        JOIN Species ON Animals.speciesID = Species.speciesID
        JOIN Habitat_enclosures ON Animals.habitatID = Habitat_enclosures.habitatID
        WHERE animalName LIKE "${req.query.animalName}%";
        `;
    }
    let query2 = "SELECT * FROM Species;";
    let query3 = "SELECT * FROM Habitat_enclosures;";
    // Run the query
    db.pool.query(query, function (error, rows, fields) {
        if (error) throw error;

        // Save the animals
        let animals = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let species = rows;
            species.sort((a, b) => a.speciesName - b.speciesName);   //Puts drop downs in order

            db.pool.query(query3, (error, rows, fields) => {
                // Save the habitat enclosures
                let habitat = rows;
                habitat.sort((a, b) => a.description - b.description);

                return res.render('animals.hbs', { data: animals, species: species, habitat: habitat });
            });
        });
    });
});




////// Display Budgets
app.get('/budgets.hbs', function (req, res) {
    let query1;

    if (req.query.budgetAmount === undefined) {
        query1 = `
            SELECT Budgets.*, Employees.hourlyWage, Habitat_enclosures.monthlyUpkeep, Admissions.ticketPrice
            FROM Budgets
            JOIN Employees ON Budgets.employeeID = Employees.employeeID
            JOIN Habitat_enclosures ON Budgets.habitatID = Habitat_enclosures.habitatID
            JOIN Admissions ON Budgets.admissionID = Admissions.admissionID;
        `;
    } else {
        query1 = `
            SELECT Budgets.*, Employees.hourlyWage, Habitat_enclosures.monthlyUpkeep, Admissions.ticketPrice
            FROM Budgets
            JOIN Employees ON Budgets.employeeID = Employees.employeeID
            JOIN Habitat_enclosures ON Budgets.habitatID = Habitat_enclosures.habitatID
            JOIN Admissions ON Budgets.admissionID = Admissions.admissionID
            WHERE Budgets.budgetAmount LIKE "${req.query.budgetAmount}%";
        `;
    }

    let query2 = "SELECT * FROM Employees;";
    let query3 = "SELECT * FROM Habitat_enclosures;";
    let query4 = "SELECT * FROM Admissions;";

    // Run the queries
    db.pool.query(query1, function (error, rows, fields) {
        // Save the budget data
        let budget = rows;

        db.pool.query(query2, (error, rows, fields) => {
            // Save the employees
            let employee = rows;
            employee.sort((a, b) => a.hourlyWage - b.hourlyWage);   //Puts drop downs in order

            db.pool.query(query3, (error, rows, fields) => {
                // Save the habitat enclosures
                let habitat = rows;
                habitat.sort((a, b) => a.monthlyUpkeep - b.monthlyUpkeep);


                db.pool.query(query4, (error, rows, fields) => {
                    // Save the admissions
                    let admission = rows;
                    admission.sort((a, b) => a.ticketPrice - b.ticketPrice);

                    return res.render('budgets.hbs', { data: budget, employee: employee, habitat: habitat, admission: admission });
                });
            });
        });
    });
});


////// Display Food and Supplies
app.get('/foodsupplies.hbs', function (req, res) {

    let query1;


    if (req.query.itemName === undefined) {
        query1 = "SELECT * FROM Food_and_supplies;";
    }

    else {
        query1 = `SELECT * FROM Food_and_supplies WHERE itemName LIKE "${req.query.itemName}%"`
    }

    let query2 = "SELECT itemID FROM Food_and_supplies_per_animal;";
    db.pool.query(query1, function (error, rows, fields) {


        let foodsupplies = rows;


        db.pool.query(query2, function (error, rows, fields) {
            // Save the item IDs
            let itemIDs = rows.map(row => row.itemID);

            return res.render('foodsupplies.hbs', { data: foodsupplies, itemIDs: itemIDs });
        });
    });
});

////// Display food and supplies per animal
app.get('/foodsuppliesperanimal.hbs', function (req, res) {

    let query1;

    if (req.query.animalItemListID === undefined) {
        query1 = "SELECT * FROM Food_and_supplies_per_animal;";
    } else {
        query1 = `SELECT * FROM Food_and_supplies_per_animal WHERE animalItemListID LIKE "${req.query.animalItemListID}%"`
    }

    let query2 = "SELECT * FROM Animals;";
    let query3 = "SELECT * FROM Food_and_supplies;"; // New query for fetching items

    db.pool.query(query1, function (error, rows, fields) {
        let foodsuppliesperanimal = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let animals = rows;
            let animalmap = {};
            animals.map(animal => {
                let animalID = parseInt(animal.animalID, 10);
                animalmap[animalID] = animal["animalName"];
            });

            foodsuppliesperanimal = foodsuppliesperanimal.map(foodsuppliesperanimals => {
                return Object.assign(foodsuppliesperanimals, { animalName: animalmap[parseInt(foodsuppliesperanimals.animalID, 10)] });
            });

            db.pool.query(query3, (error, rows, fields) => {
                let foodsupplies = rows;
                let itemMap = {};
                foodsupplies.map(item => {
                    let itemID = parseInt(item.itemID, 10);
                    itemMap[itemID] = item["itemName"];
                });

                foodsuppliesperanimal = foodsuppliesperanimal.map(foodsuppliesperanimals => {
                    return Object.assign(foodsuppliesperanimals, { itemName: itemMap[parseInt(foodsuppliesperanimals.itemID, 10)] });
                });

                return res.render('foodsuppliesperanimal', { data: foodsuppliesperanimal, animals: animals, foodsupplies: foodsupplies });
            });
        });
    });
});


////// Display Habitat
app.get('/habitat.hbs', function (req, res) {

    let query1;


    if (req.query.description === undefined) {
        query1 = "SELECT * FROM Habitat_enclosures;";
    }

    else {
        query1 = `SELECT * FROM Habitat_enclosures WHERE description LIKE "${req.query.description}%"`
    }


    db.pool.query(query1, function (error, rows, fields) {


        let habitat = rows;


        return res.render('habitat', { data: habitat });
    })
});

//-------------------------------------------------------------------------------------------------
// INSERT
//-------------------------------------------------------------------------------------------------

app.post('/add-employee-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Capture NULL values
    let phoneNum = parseInt(data.phoneNum);
    if (isNaN(phoneNum)) {
        phoneNum = 'NULL'
    }

    let hourlyWage = parseInt(data.hourlyWage);
    console.log(data);

    if (isNaN(hourlyWage)) {
        hourlyWage = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (firstName, lastName, phoneNum, hourlyWage, workEmail) VALUES ('${data.firstName}', '${data.lastName}', '${data.phoneNum}', '${data.hourlyWage}', '${data.workEmail}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * Employees
            query2 = `SELECT * FROM Employees;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-species-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO Species (speciesName, description) VALUES ('${data.speciesName}', '${data.description}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * from Species
            query2 = `SELECT * FROM Species;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});
app.post('/add-admission-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture the admissionTotal and ticketPrice values and ensure they are not null
    let admissionTotal = parseFloat(data.admissionTotal);
    if (isNaN(admissionTotal) || admissionTotal < 0) {
        admissionTotal = 0; // Set a default value or any other desired behavior
    }

    let ticketPrice = parseFloat(data.ticketPrice);
    if (isNaN(ticketPrice) || ticketPrice < 0) {
        ticketPrice = 0; // Set a default value or any other desired behavior
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Admissions (admissionTotal, ticketPrice, description) VALUES (${admissionTotal}, ${ticketPrice}, '${data.description}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * from Admissions
            query2 = `SELECT * FROM Admissions;`;
            db.pool.query(query2, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // If all went well, send the results of the query back.
                    res.send(rows);
                }
            });
        }
    });
});

// Add the following route to handle adding habitat enclosures
app.post('/add-habitat-ajax', function (req, res) {
    let data = req.body;

    let monthlyUpkeep = parseFloat(data.monthlyUpkeep);
    if (isNaN(monthlyUpkeep) || monthlyUpkeep < 0) {
        monthlyUpkeep = 0; // Set a default value or any other desired behavior
    }

    let capacity = parseFloat(data.capacity);
    if (isNaN(capacity) || capacity < 0) {
        capacity = 0; // Set a default value or any other desired behavior
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Habitat_enclosures (monthlyUpkeep, capacity, description) VALUES (${monthlyUpkeep}, ${capacity}, '${data.description}')`;


    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the insertion was successful, you can fetch the updated list of habitat enclosures
            query2 = `SELECT * FROM Habitat_enclosures;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});
app.post('/add-food-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO Food_and_supplies (itemName, quantity, price) VALUES ('${data.itemName}','${data.quantity}', '${data.price}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * from Species
            query2 = `SELECT * FROM Food_and_supplies;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});
app.post('/add-animal-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let description = parseInt(data.description);
    if (isNaN(description)) {
        description = 'NULL'
    }

    let habitatDescription = parseInt(data.habitatDescription);
    if (isNaN(habitatDescription)) {
        habitatDescription = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Animals (animalName, description, speciesName, habitatDescription) VALUES ('${data.animalName}', '${data.description}','${data.speciesName}', ${habitatDescription})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Animals
            query2 = `SELECT * FROM Animals;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});
app.post('/add-budget-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Parse INT values and handle NULL cases
    let budgetAmount = parseFloat(data.budgetAmount);
    let hourlyWage = parseFloat(data.hourlyWage);
    let monthlyUpkeep = parseFloat(data.monthlyUpkeep);
    let ticketPrice = parseFloat(data.ticketPrice);

    if (isNaN(budgetAmount) || isNaN(hourlyWage) || isNaN(monthlyUpkeep) || isNaN(ticketPrice)) {
        // If any of the values are not valid, send a 400 response
        console.log("Invalid input data.");
        res.sendStatus(400);
    } else {
        // Create the query and run it on the database
        query1 = `INSERT INTO Budgets (budgetAmount, hourlyWage, monthlyUpkeep, ticketPrice) VALUES (${budgetAmount}, ${hourlyWage}, ${monthlyUpkeep}, ${ticketPrice})`;;
        db.pool.query(query1, function (error, rows, fields) {
            if (error) {
                // Log the error and send a 400 response
                console.log(error);
                res.sendStatus(400);
            } else {
                // If there was no error, perform a SELECT * on Budgets
                query2 = `SELECT * FROM Budgets;`;
                db.pool.query(query2, function (error, rows, fields) {
                    if (error) {
                        // Log the error and send a 400 response
                        console.log(error);
                        res.sendStatus(400);
                    } else {

                        res.send(rows);
                    }
                });
            }
        });
    }
});

//-------------------------------------------------------------------------------------------------
// DELETE
//-------------------------------------------------------------------------------------------------

// Delete an employee
app.delete('/delete-employee-ajax/', function (req, res, next) {
    let data = req.body;
    let employeeID = parseInt(data.id);
    let deleteBudget = `DELETE FROM Budgets WHERE employeeID = ? `;
    let deleteEmployee = `DELETE FROM Employees WHERE employeeID = ? `;


    // Run the 1st query
    db.pool.query(deleteBudget, [employeeID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteEmployee, [employeeID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

function deleteRow(employeeID) {

    let table = document.getElementById("employee-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == employeeID) {
            table.deleteRow(i);
            deleteDropDownMenu(employeeID);
            break;
        }
    }
}


function deleteDropDownMenu(employeeID) {
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(employeeID)) {
            selectMenu[i].remove();
            break;
        }

    }
}

app.delete('/delete-species-ajax/', function (req, res, next) {
    let data = req.body;
    let speciesID = parseInt(data.id);
    let updateAnimalSpecies = 'UPDATE Animals SET speciesID = NULL WHERE speciesID = ?';
    let deleteSpecies = 'DELETE FROM Species WHERE speciesID = ?';


    // Run the 1st query
    db.pool.query(updateAnimalSpecies, [speciesID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteSpecies, [speciesID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});


function deleteRow(speciesID) {

    let table = document.getElementById("species-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == speciesID) {
            table.deleteRow(i);
            deleteDropDownMenu(speciesID);
            break;
        }
    }
}


function deleteDropDownMenu(speciesID) {

    let selectMenu = document.getElementById("input-speciesID-ajax");

    for (let i = 0; i < selectMenu.length; i++) {

        if (Number(selectMenu.options[i].value) === Number(speciesID)) {

            selectMenu[i].remove();

            break;

        }

    }

}
app.delete('/delete-food-and-supply-animal-ajax/', function (req, res, next) {

    let data = req.body;

    let speciesID = parseInt(data.id);



    let deleteFoodsuppliesperanimal = 'DELETE FROM Food_and_supplies_per_animal WHERE animalItemListID = ?'





    // Run the 1st query

    db.pool.query(deleteFoodsuppliesperanimal), [animalItemListID], function (error, rows, fields) {

        if (error) {



            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.

            console.log(error);

            res.sendStatus(400);

        }



        else {

            res.sendStatus(204);

        }



    }

});



function deleteRow(animalItemListID) {

    let table = document.getElementById("foodsuppliesperanimal-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == animalItemListID) {
            table.deleteRow(i);
            deleteDropDownMenu(animalItemListID);
            break;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// UPDATE
//-------------------------------------------------------------------------------------------------


app.put('/update-employee-ajax/', function (req, res) {
    let employeeID = req.params.id;

    let updateQuery = 'UPDATE Employees SET hourlyWage = ? WHERE employeeID = ?'

    db.pool.query(updateQuery, [employeeID], function (error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

function deleteRow(employeeID) {

    let table = document.getElementById("employee-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == employeeID) {
            table.deleteRow(i);
            deleteDropDownMenu(employeeID);
            break;
        }
    }
}


function deleteDropDownMenu(employeeID) {
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(employeeID)) {
            selectMenu[i].remove();
            break;
        }

    }
}


//-------------------------------------------------------------------------------------------------
// UPDATE
//-------------------------------------------------------------------------------------------------


app.put('/put-employee-ajax', function (req, res, next) {
    let data = req.body;

    let hourlyWage = parseInt(data.hourlyWage);
    let employee = parseInt(data.fullname);

    let queryUpdateHourlyWage = `UPDATE Employees Set hourlywage = ? WHERE employeeID = ? `;
    let selectEmployee = `SELECT * FROM Employees WHERE employeeID = ? `

    // Run the 1st query
    db.pool.query(queryUpdateHourlyWage, [hourlyWage, employee], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400).send('The employee hourly wage cannot be updated.');
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectEmployee, [employee], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            }
            )
        }
    })
});



//-------------------------------------------------------------------------------------------------
// LISTENER
//-------------------------------------------------------------------------------------------------
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
