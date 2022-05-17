//import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require("./db/connection");

require('dotenv').config();

//connect to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employee_db'
    }
);
//show error if unable to connect or log successful connection
connection.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    startTracker();
});

//function to start the app
const startTracker = () => {
   console.log( `
   ==============================
   
        EMPLOYEE TRACKER
        
    =============================
    `);
    beginPrompts(); 
};

//inquirer prompts to select options
const beginPrompts = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'Welcome to the Employee Tracker Menu.  Which option would you like to do?',
            choices: [ 'View all departments',
                        'View all roles',
                        'View all employees',
                        'Add a department',
                        'Add a role',
                        "Add an employee",
                        'Update an employee role',
                        'Update an employee manager',
                        'View employees by department',
                        'Delete a department',
                        'Delete a role',
                        'Delete an employee',
                        'View department budgets',
                        'Quit']
        }
    ])
    .then(userOptionChoice => {
        switch(userOptionChoice.options) {
            case 'View all departments':
                displayDepartments();
                break;
                
            case 'View all roles':
                displayRoles();
                break;

            case 'View all employees':
                displayEmployees();
                break;

            case 'Add a department':
                addNewDepartment();
                break;

            case 'Add a role':
                addNewRole();
                break;

            case 'Add an employee':
                addNewEmployee();
                break;

            case 'Update employee role':
                editEmployee();
                break;

            case 'Update employee manager':
                editManager();
                break;

            case 'View employees by department':
                employeeByDepartment();
                break;

            case 'Delete a department':
                removeDepartment();
                break;

            case 'Delete a role':
                removeRole();
                break;

            case 'Delete an employee':
                removeEmployee();
                break;

            case 'View department budgets':
                displayBudget();
                break;
                
            default:
                process.quit();
        }
    });
};

//function to display all departments
const displayDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        beginPrompts();
    })
};

//function to display all roles
const displayRoles = () => {
    console.log('Showing all roles....\n');
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        beginPrompts();
    })
};

//function to display all employees
const displayEmployees = () => {
    console.log("Showing all employees....\n");
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name AS department,
                role.salary,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

        connection.promise().query(sql, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            beginPrompts();
        })
};

//function to add a new department
const addNewDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department would you like to add?',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('To proceed, please enter a department.');
                    return false;
                }
            }
        }
    ])
    .then(response => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        connection.promise().query(sql, response.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added' + response.addDepartment + 'to departments');
            displayDepartments();
        });
    });
};

//function to create a new role
const addNewRole = () => {
return inquirer.prompt([
    {
        type: 'input',
        name: 'newRole',
        message: 'What role would you like to add?',
        validate: newRole => {
            if(newRole) {
                return true;
            } else {
                console.log('To proceed, please enter a role.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'newSalary',
        message: 'What is the salary for this role?',
        validate: newSalary => {
            if(newSalary) {
                return true;
            } else {
                console.log('To proceed, please enter a salary');
                return false;
            }
        }
    }
])
.then(response => {
    const params = [response.role, response.salary];

    const newRoleSql = `SELECT name, id FROM department`;

    connection.promise().query(newRoleSql, (err, data) => {
        if (err) throw err;
        
        const newDept = data.map(({ name, id })=> ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'newDept',
                message: 'What department does this role belong in?',
                choices: newDept
            }
        ])
        .then(deptName => {
            const newDept = deptName.newDept;
            params.push(newDept);
            const sql = `INSERT INTO role (title, salary department_id)
                        VALUES (?, ?, ?)`;

            connection.promise().query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + deptName.role + 'to roles');

                displayRoles();
            });
        });
    });
});
};

//function to add a new employee
const addNewEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name:'firstName',
            message: "what is the new employee's first name?",
            validate: addFirstName => {
                if(addFirstName) {
                    return true;
                } else {
                    console.log('To proceed, please enter the first name of the employee');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the new employee?',
            validate: addLastName => {
                if(addLastName) {
                    return true;
                } else {
                    console.log('To proceed, please enter the last name of the employee');
                    return false;
                }
            }
        }

    ])
    .then(response => {
        const params = [response.firstName, response.lastName];
        
        //select from the roles table
        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;

            const empRoles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: "What is this employee's role?",
                    choices: empRoles
                }
            ])
            .then(roleSelected => {
                const employeeRole = roleSelected.empRoles;
                params.push(employeeRole);

                //associate the new employee with a manager
                const managersSql = `SELECT * FROM employee`;

                connection.promise().query(managersSql, (err, data) => {
                    if (err) throw err;

                    const managersList = data.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the manager for this employee?',
                            choices: managersList
                        }
                    ])
                    .then(managerSelected => {
                        const manager = managerSelected.manager;
                        params.push(manager);

                        //add to employee table
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manger_id) Values (?, ?, ?, ?)`;

                        connection.promise().query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('New employee added');

                        displayEmployees();
                        });
                    });
                });
            });
        });
    });
};

//function to edit an employee's info
const editEmployee = () => {
    //select employeee from employee table
    const employeesSql = `SELECT * FROM employee`;

    connection.promise().query(employeesSql, (err, data) => {
        if (err) throw err;

        const currentEmp = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'empName',
                message: 'Please select an employee to update',
                choices: currentEmp
            }
        ])
        .then(empSelected => {
            const emp = empSelected.empName;
            const params = [];
            params.push(emp);

            const rolesSql = `SELECT * FROM role`;

            connection.promise().query(rolesSql, (err, data) => {
                if (err) throw err;

                const empRoles = data.map(({ id, title }) => ({name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeRole',
                        message: 'What is the new role of the employee?',
                        choices: empRoles
                    }
                ])
                .then(roleSelected => {
                    const newRole = roleSelected.employeeRole;
                    params.push(newRole); 

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee info has been updated');

                        displayEmployees();
                    });
                });
            });
        });
    });
};


