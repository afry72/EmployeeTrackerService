const inquirer = require('inquirer');

function viewEmployee(db, runProgram) {
    const queryEmp = 'SELECT e.id, e.first_name, e.last_name, e.manager_id, j.title AS job_title, j.wage FROM employee e JOIN job j ON e.job_id = j.id;';


    db.query(queryEmp, (error, results) => {
        if (error) {
            console.error('Error fetching Employee data:', error);
            runProgram();
            return;
        }

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




const addEmployee = async (db, runProgram) => {
    const [jobs] = await db.promise().query('SELECT title FROM job');

    const pickJob = jobs.map(job => job.title);

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

    var managerBoolean = 0;

    if (newEmp.managerYN == 'yes') {
        managerBoolean = 1;
    };

    const findJobId = await db.promise().query('SELECT id FROM job WHERE title = ?', newEmp.newEmpJob);

    const jobId = findJobId[0][0].id;

    await db.promise().query(
        'INSERT INTO employee (job_id, manager_id, first_name, last_name) VALUES (?, ?, ?, ?)',
        [jobId, managerBoolean, newEmp.firstName, newEmp.lastName]
    );

    console.log("Employee Added");
    runProgram();
};

const updateEmployee = async (db, runProgram) => {
    const [employeeList] = await db.promise().query('SELECT first_name, last_name FROM employee');

    const pickEmp = employeeList.map(employee => `${employee.first_name} ${employee.last_name}`);

    const [jobs] = await db.promise().query('SELECT title FROM job');

    const pickJob = jobs.map(job => job.title);

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

    if (newEmpJob.manageChange == 'yes') {
        managerBoolean = 1;
    };

    //console.log(managerBoolean);

    const findJobId = await db.promise().query('SELECT id FROM job WHERE title = ?', newEmpJob.jobPick);
    //console.log(findJobId);
    const jobId = findJobId[0][0].id;

    const empFirstName = newEmpJob.empSelect.split(' ')[0];
    const empLastName = newEmpJob.empSelect.split(' ')[1];

    await db.promise().query(
        'UPDATE employee SET job_id = ?, manager_id = ? WHERE first_name = ? AND last_name = ?',
        [jobId, managerBoolean, empFirstName, empLastName]
    );

    console.log("Update Applied");
    runProgram();
};

module.exports = {viewEmployee, addEmployee, updateEmployee};