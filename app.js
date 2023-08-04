// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 9445                 // Set a port number at the top so it's easy to change in the future

// app.js

// Database
var db = require('./database/db-connector')


// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
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
        let people = rows;


        return res.render('employees.hbs', { data: people });
    })
});

app.post('/add-employee-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let phoneNum = parseInt(data.phoneNum);
    if (isNaN(phoneNum)) {
        phoneNum = 'NULL'
    }

    let hourlyWage = parseInt(data.hourlyWage);
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
app.delete('/delete-employee-ajax/', function (req, res) {
    let employeeID = req.params.id;

    let deleteQuery = `DELETE FROM Employees WHERE employeeID = ?`;

    db.pool.query(deleteQuery, [employeeID], function (error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


app.put('/put-employee-ajax', function (req, res, next) {
    let data = req.body;

    let hourlyWage = parseInt(data.hourlyWage);
    let employee = parseInt(data.fullname);

    let queryUpdateWage = `UPDATE Employees SET hourlyWage = ? WHERE employeeID = ?`;
    let selectWage = `SELECT * FROM Employees WHERE hourlyWage = ?`

    // Run the 1st query
    db.pool.query(queryUpdateWage, [hourlyWage, employee], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectWage, [hourlyWage], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
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


/////// Admissions
app.get('/admissions.hbs', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.admissionID === undefined) {
        query1 = "SELECT * FROM Admissions;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Admissions WHERE admissionID LIKE "${req.query.admissionID}%"`
    }


    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {

        // Save the people
        let admission = rows;


        return res.render('admissions', { data: admission });
    })
});

/////// Species
app.get('/species.hbs', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.speciesID === undefined) {
        query1 = "SELECT * FROM Species;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Species WHERE speciesName LIKE "${req.query.speciesName}%"`
    }


    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {

        // Save the people
        let species = rows;


        return res.render('species', { data: species });
    })
})
    ;

////// Display Animals
app.get('/animals.hbs', function (req, res) {
    res.render('animals');
});

////// Display Budgets
app.get('/budgets.hbs', function (req, res) {
    res.render('budgets');
});

////// Display Food and Supplies
app.get('/foodsupplies.hbs', function (req, res) {
    res.render('foodsupplies');
});

////// Display food and supplies per animal
app.get('/foodsuppliesperanimal.hbs', function (req, res) {
    res.render('foodsuppliesperanimal');
});
////// Display Habitat
app.get('/habitat.hbs', function (req, res) {
    res.render('habitat');
});
/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});