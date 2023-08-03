// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
    let query1 = "SELECT * FROM Employees;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('index', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// app.js - ROUTES section

app.post('/add-employee-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let phoneNum = parseInt(data.phoneNum);
    if (isNaN(phoneNum))
    {
        phoneNum = 'NULL'
    }

    let hourlyWage = parseInt(data.hourlyWage);
    if (isNaN(hourlyWage))
    {
        hourlyWage = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (firstName, lastName, phoneNum, hourlyWage, workEmail) VALUES ('${data.firstName}', '${data.lastName}', '${data.phoneNum}', '${data.hourlyWage}', '${data.workEmail}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * Employees
            query2 = `SELECT * FROM Employees;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});






/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});