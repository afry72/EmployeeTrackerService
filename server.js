const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');



const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '*juhec2GR0OTt88330502',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

// Query database
/*db.query('SELECT * FROM students', function (err, results) {
  console.log(results);
}); */

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const questions = [
    {
        type: 'list',
        message: 'placeholder',
        name: 'license',
        choices: [
          "View Departments",
          "View Employees",
          "View jobs",
          "Add a Department",
          "Add a job",
          "Add an Employee",
          "Update Employee",
          ],
    },
];

const runProgram = async () => {
    console.log("placeholder");
    await inquirer.prompt(questions);
};

runProgram();