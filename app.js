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




app.get('/', function (req, res) {
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


        return res.render('index', { data: people });
    })
})
    ;
// app.js - ROUTES section

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


app.put('/put-employee-ajax/', function (req, res) {
    let hourlyWage = req.params.id;

    let updateQuery = `UPDATE FROM Employees SET hourlyWage = ? WHERE employeeID = ?`;

    db.pool.query(updateQuery, [hourlyWage], function (error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


function deleteRow(employeeID){

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


function deleteDropDownMenu(employeeID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(employeeID)){
      selectMenu[i].remove();
      break;
    } 

  }
}

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});