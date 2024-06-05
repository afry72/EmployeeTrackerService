const inquirer = require('inquirer');
// function to view all of the jobs in company_db 

function viewJob(db, runProgram) {
    // query to retrieve job information and joining it with its corresponding department 
    const queryJob = 'SELECT j.id, j.title, j.wage, d.dep_name AS department_name FROM job j JOIN department d ON j.dep_id = d.id;';
    
    // query to retrieve every data point within jobs and then output a section for each point, otherwise it will throw an error 
    db.query(queryJob, (error, results) => {
        if (error) {
            console.error('Error fetching job data:', error);
            runProgram();
            return;
        }
        //making sure that the query actually returned data and then output all data associated with the job  
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
//function to add a job into company_db
const addJob = async (db, runProgram) => {
    // querys all department names from department 
    const [deps] = await db.promise().query('SELECT dep_name FROM department');
    // takes information from previous query and maps all of the department names 
    const departmentNames = deps.map(department => department.dep_name);
    //creating an array of objects containing department names each with both name and value properties 
    const pickDep = departmentNames.map(departmentName => ({
        name: departmentName,
        value: departmentName
    }));
    // prompts user for the name of the new job, which department it is part of, and what the wage of that job is 
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
    // query the databse to find the id of the department corresponding to the provided department name 
    const findDepId = await db.promise().query('SELECT id FROM department WHERE dep_name = ?', newJob.ascDep);
    // taking the information from the department query and putting it into a const
    const depID = findDepId[0][0].id;
    // taking the given name and putting it into a const
    const newJobTitle = newJob.newJobName;
    // taken the given wage and putting it into a const 
    const wage = newJob.pph
    //once all information is given and put into const it will insert given data into the job data set
    await db.promise().query(
        'INSERT INTO job (title, wage, dep_id) VALUES (?, ?, ?)',
        [newJobTitle, wage, depID]
    );
    //once action is done it logs that the job was added and will reset the menu 
    console.log("Job Added");
    runProgram();
};

module.exports = {viewJob, addJob}