const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
//importing functions for viewing adding and updating employees departments and jobs
const {viewEmployee, addEmployee, updateEmployee} = require('./assets/js/employee.js');
const {viewDepartment, addDepartment} = require('./assets/js/department.js');
const {viewJob, addJob} = require('./assets/js/job.js');



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

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});
//once port is open the console will log it 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Home screen questions giving the basic options for this application 
const questions = [
    {
        type: 'list',
        message: 'What would you like to do',
        name: 'homeScreen',
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
// Async function to run the employee management system prompting user input and directing database operations based on selected option using the switch case break function
const runProgram = async () => {
    console.log("=======");
    console.log("Employee Management System(press Ctrl+C to exit)");
    await inquirer.prompt(questions)
    .then (response => {
        //console.log(response, "logged");
        switch(response.homeScreen){
            case 'View Departments':
                viewDepartment(db, runProgram);
                break;
            case 'View Employees':
                viewEmployee(db, runProgram);
                break;
            case 'View jobs':
                //console.log("running");
                viewJob(db, runProgram);
                break; 
            case 'Add a Department':
                addDepartment(db, runProgram);
                break;
            case 'Add a job':
                addJob(db, runProgram);
                break;
            case 'Add an Employee':
                addEmployee(db, runProgram);
                break;
            case 'Update Employee':
                updateEmployee(db, runProgram);
                break;
        };
    }
    );
};

runProgram();