const inquirer = require('inquirer');

function viewJob(db, runProgram) {
    const queryJob = 'SELECT j.id, j.title, j.wage, d.dep_name AS department_name FROM job j JOIN department d ON j.dep_id = d.id;';


    db.query(queryJob, (error, results) => {
        if (error) {
            console.error('Error fetching job data:', error);
            runProgram();
            return;
        }

        if (results && results.length > 0) {
            results.forEach(job => {
                console.log("________");
                console.log("id:", job.id);
                console.log("title:", job.title);
                console.log("hourly wage:", job.wage);
                console.log("department:", job.department_name);
            });
        } else {
            console.log('No jobs found.');
        }

        runProgram();
    });
}

const addJob = async (db, runProgram) => {
    const [deps] = await db.promise().query('SELECT dep_name FROM department');

    const departmentNames = deps.map(department => department.dep_name);

    const pickDep = departmentNames.map(departmentName => ({
        name: departmentName,
        value: departmentName
    }));

    const newJob = await inquirer.prompt([
        {
            type: 'input',
            message: 'Name of job',
            name: 'newJobName',
        },
        {
            type: 'list',
            message: 'which department does this belong too',
            name: 'ascDep',
            choices: pickDep
        },
        {
            type: 'input',
            message: 'Pay Per Hour',
            name: 'pph',
        },
    ])

    const findDepId = await db.promise().query('SELECT id FROM department WHERE dep_name = ?', newJob.ascDep);

    const depID = findDepId[0][0].id;

    const newJobTitle = newJob.newJobName;

    const wage = newJob.pph

    await db.promise().query(
        'INSERT INTO job (title, wage, dep_id) VALUES (?, ?, ?)',
        [newJobTitle, wage, depID]
    );

    console.log("Job Added");
    runProgram();
};

module.exports = {viewJob, addJob}