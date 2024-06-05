const inquirer = require('inquirer');
// this function is to view all employees inside of the company_db database
function viewEmployee(db, runProgram) {
    // query to retrieve employee information and join it with the associated job id 
    const queryEmp = 'SELECT e.id, e.first_name, e.last_name, e.manager_id, j.title AS job_title, j.wage FROM employee e JOIN job j ON e.job_id = j.id;';

    // query retrieving the data set from employees and then outputting all data associated with it 
    db.query(queryEmp, (error, results) => {
        if (error) {
            console.error('Error fetching Employee data:', error);
            runProgram();
            return;
        }
        // makes sure data is returned and then outputs every data point in a section 
        if (results && results.length > 0) {
            results.forEach(employee => {
                console.log("________");
                console.log("id:", employee.id);
                console.log("name:", employee.first_name, employee.last_name);
                console.log("hourly wage:", employee.wage);
                console.log("job:", employee.job_title);
                console.log("Manager:", employee.manager_id);
            });
        } else {
            console.log('No employees found.');
        }

        runProgram();
    });
}



// this function adds uses user input to add an employee into company_db database
const addEmployee = async (db, runProgram) => {
    //pulls all titles from the job data set 
    const [jobs] = await db.promise().query('SELECT title FROM job');
    // takes information from previous query and maps all of the available jobs
    const pickJob = jobs.map(job => job.title);
    //prompts user for the new employees job, if its a manager, and then its first and last name 
    const newEmp = await inquirer.prompt([
        {
            type: 'list',
            message: 'What Job does this Employee do',
            name: 'newEmpJob',
            choices: pickJob
        },
        {
          type: 'list',
          message: 'Is this Employee a manager?',
          name: 'managerYN',
          choices: [
            "yes",
            "no",
          ],
        },
        {
          type: 'input',
          message: 'New Employees first name',
          name: 'firstName',
        },
        {
          type: 'input',
          message: 'New Employees last name',
          name: 'lastName',
        },
    ])
    //sets manager boolean to 0
    var managerBoolean = 0;
    //check to see if manager question was a yes and then changes the boolean to true 
    if (newEmp.managerYN == 'yes') {
        managerBoolean = 1;
    };
    //query the database to find the id of job titles associated with the provided job
    const findJobId = await db.promise().query('SELECT id FROM job WHERE title = ?', newEmp.newEmpJob);
    //taking information from the job query and putting into a const 
    const jobId = findJobId[0][0].id;
    //once all information is grabbed put data into a SQL insert statement 
    await db.promise().query(
        'INSERT INTO employee (job_id, manager_id, first_name, last_name) VALUES (?, ?, ?, ?)',
        [jobId, managerBoolean, newEmp.firstName, newEmp.lastName]
    );
    // log that employee is added then reset the menu 
    console.log("Employee Added");
    runProgram();
};
// this function updates an employee thats already in the database 
const updateEmployee = async (db, runProgram) => {
    // querys all employees and pulls first and last names 
    const [employeeList] = await db.promise().query('SELECT first_name, last_name FROM employee');
    // takes all of the names pulled and maps them
    const pickEmp = employeeList.map(employee => `${employee.first_name} ${employee.last_name}`);
    // querys all jobs by titles 
    const [jobs] = await db.promise().query('SELECT title FROM job');
    // maps out all given jobs 
    const pickJob = jobs.map(job => job.title);
    // prompts user for what employee they want to update and then what job they should be changed too and if they want to change manager status 
    const newEmpJob = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which Employee will be updated',
            name: 'empSelect',
            choices: pickEmp
        },
        {
          type: 'list',
          message: 'What Job does this Employee have now',
          name: 'jobPick',
          choices: pickJob
        },
        {
          type: 'list',
          message: 'is this employee a manager',
          name: 'manageChange',
          choices: [
            "yes",
            "no",
          ],
        },
    ])

    var managerBoolean = 0;
    // similar to add employee this checks to see if the manager boolean has been changed to yes
    if (newEmpJob.manageChange == 'yes') {
        managerBoolean = 1;
    };

    //console.log(managerBoolean);
    //query the databse for job titles 
    const findJobId = await db.promise().query('SELECT id FROM job WHERE title = ?', newEmpJob.jobPick);
    //console.log(findJobId);
    const jobId = findJobId[0][0].id;
    //splitting the name string into first and last 
    const empFirstName = newEmpJob.empSelect.split(' ')[0];
    const empLastName = newEmpJob.empSelect.split(' ')[1];
    //update the employee with the appropriate information 
    await db.promise().query(
        'UPDATE employee SET job_id = ?, manager_id = ? WHERE first_name = ? AND last_name = ?',
        [jobId, managerBoolean, empFirstName, empLastName]
    );

    console.log("Update Applied");
    runProgram();
};

module.exports = {viewEmployee, addEmployee, updateEmployee};