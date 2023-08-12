

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


    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {

        // Save the people
        let employee = rows;


        return res.render('employees.hbs', { data: employee });
    })
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

    // Run the query
    db.pool.query(query, function (error, rows, fields) {
        if (error) throw error;

        // Save the animals
        let animals = rows;

        return res.render('animals.hbs', { data: animals });
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


    db.pool.query(query1, function (error, rows, fields) {


        let foodsupplies = rows;


        return res.render('foodsupplies', { data: foodsupplies });
    })
});

////// Display food and supplies per animal
app.get('/foodsuppliesperanimal.hbs', function (req, res) {

    let query1;


    if (req.query.animalItemListID === undefined) {
        query1 = "SELECT * FROM Food_and_supplies_per_animal;";
    }

    else {
        query1 = `SELECT * FROM Food_and_supplies_per_animal WHERE animalItemListID LIKE "${req.query.animalItemListID}%"`
    }


    db.pool.query(query1, function (error, rows, fields) {


        let foodsuppliesperanimal = rows;


        return res.render('foodsuppliesperanimal', { data: foodsuppliesperanimal });
    })
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

    // Capture NULL values
    let monthlyUpkeep = parseFloat(data.monthlyUpkeep);
    if (isNaN(monthlyUpkeep)) {
        monthlyUpkeep = null;
    }

    let capacity = parseInt(data.capacity);
    if (isNaN(capacity)) {
        capacity = null;
    }

    // Create the query and run it on the database
    query = `INSERT INTO habitat_enclosures (monthly_upkeep, capacity, description) VALUES ('${monthlyUpkeep}', '${capacity}', '${data.description}')`;


    db.pool.query(query, values, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the insertion was successful, you can fetch the updated list of habitat enclosures
            const selectQuery = `SELECT * FROM habitat_enclosures`;
            db.pool.query(selectQuery, function (error, rows) {
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

//-------------------------------------------------------------------------------------------------
// DELETE
//-------------------------------------------------------------------------------------------------

// Delete an employee
app.delete('/delete-employee-ajax/', function (req, res, next) {
    let data = req.body;
    let employeeID = parseInt(data.id);
    let deleteBudget = `DELETE FROM Budgets WHERE employeeID = ?`;
    let deleteEmployee = `DELETE FROM Employees WHERE employeeID = ?`;


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


//-------------------------------------------------------------------------------------------------
// UPDATE
//-------------------------------------------------------------------------------------------------


app.put('/update-employee-ajax/', function (req, res) {
    let employeeID = req.body.id;

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

    let queryUpdateHourlyWage = `UPDATE Employees Set hourlywage = ? WHERE employeeID = ?`;
    let selectEmployee = `SELECT * FROM Employees WHERE employeeID = ?`

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
