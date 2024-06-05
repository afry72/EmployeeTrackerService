const inquirer = require('inquirer');
//function to view departments
function viewDepartment(db, runProgram) {
    const queryDep = 'SELECT * FROM department';
    //finds all of the departments and then outputs a section for each department

    db.query(queryDep, (error, results) => {
        if (error) {
            console.error('Error fetching Department data:', error);
            runProgram();
            return;
        }

        if (results && results.length > 0) {
            results.forEach(department => {
                console.log("________");
                console.log("id:", department.id);
                console.log("title:", department.dep_name);
            });
        } else {
            console.log('No departments found.');
        }

        runProgram();
    });
};
//function to add more departments 
const addDepartment = async (db, runProgram) => {
    const addDep = await inquirer.prompt([
        {
            type: 'input',
            message: 'Name of Department',
            name: 'newDep',
        },
    ])

    const addNewDep = addDep.newDep;

    await db.promise().query('INSERT INTO department (dep_name) VALUES (?)', addNewDep);

    console.log("Department Added");
    runProgram();
};


module.exports = {viewDepartment, addDepartment}