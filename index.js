// Import and require mysql2 and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');
//Import dotenv to use env parameters
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Kr0n0s1998!',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.\n Welcome to the employee tracker.`)
  );

// Main menu where user can view and change the employee database
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menuChoice',
        choices: [
          {
            name: 'View all departments', 
            value: 1
          },
          {
            name: 'View all roles',
            value: 2
          },
          {
            name: 'View all employees',
            value: 3
          },
          {
            name: 'Add a department',
            value: 4
          },
          {
            name: 'Add a role',
            value: 5
          },
          {
            name: 'Add an employee',
            value: 6
          },
          {
            name: 'Update an employee role',
            value: 7
          },
          {
            name: 'Quit', 
            value: 8
          }
        ]
      }
    ])
    .then((response) => {
      console.log(response.menuChoice)
      switch (response.menuChoice) {
        case 1:
          return viewAllDepartments();
        case 2:
          return viewAllRoles();
        case 3:
          return viewAllEmployees();
        case 4:
          return addDepartment();
        case 5:
          return addRole();
        case 6:
          return addEmployee();
        case 7:
          return updateRole();
        case 8:
          return quitApp();
      }
    }).then()
}

// View all departments
function viewAllDepartments() {
  console.log('View all departments')
  const sql = `SELECT * FROM departments`
  db.query(sql, (error, result) => {
    if (error) throw error;
    console.table(result);
    return mainMenu()
  })
}

// View all roles
function viewAllRoles() {
  const sql = 
  `SELECT roles.id, roles.job_title, department, roles.salary
  FROM roles
  INNER JOIN departments
  ON roles.department_id = departments.id;`
  db.query(sql, (error, result) => {
    if (error) throw error;
    console.table(result);
    return mainMenu()
  })
}

function viewAllEmployees() {
  const sql = 
  `SELECT e.id,
  e.first_name,
  e.last_name,
  r.job_title,
  department,
  r.salary,
  CONCAT(employees.first_name, ' ', employees.last_name) AS 'manager'
  FROM employees AS e
  INNER JOIN roles AS r
  ON e.job_title = r.id
  INNER JOIN departments
  ON r.department_id = departments.id
  LEFT JOIN employees
  ON e.manager = employees.id
  ORDER BY e.id;`
  db.query(sql, (error, result) => {
    if (error) throw error;
    console.table(result);
    return mainMenu()
  })
}

// Create a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'newDepartment'
      }
    ]).then((response) => {
      const sql = `INSERT INTO departments (department)
      VALUES (?)`;
      const params = [response.newDepartment];
      db.query(sql, params, (error, result) => {
        if (error) throw error;
        console.log(`Added ${response.newDepartment} to Departments.`);
        return mainMenu()
      })
    })
}

// Add a role
function addRole() {
  let departmentsChoices = []
  db.query("SELECT * FROM departments", function (err, result, fields) {
    for (i=0; i < length(result); i++) {
      departmentsChoices.push({
          name: result[i].department,
          value: result[i].id
        });
    };
    if (err) {
      console.log(err);
    }
  });
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the name of the new role?',
        name: 'newRole'
      },
      {
        type: 'input',
        message: 'What is the salary for the new role?',
        name: 'newRoleSalary'
      },
      {
        type: 'list',
        message: 'What department does the role belong to?',
        name: 'newRoleDepartment',
        choices: departmentsChoices
      }      
    ]).then((response) => {
      const sql = `INSERT INTO roles (job_title, department_id, salary)
      VALUES (?)`;
      const params = [response.newRole, response.newRoleDepartment[1], response.newRoleSalary];
      console.log('Adding role to database...');
      db.query(sql, params, (error, result) => {
        if (error) throw error;
        console.log(`Added ${response.newRole} to Roles.`);
        return mainMenu()
      })
    })
}

function addEmployee() {
  let rolesChoices = [];
  let employeesChoices = [];
  db.query("SELECT * FROM roles", function (err, result, fields) {
    for (i=0; i < length(result); i++) {
      rolesChoices.push({
          name: result[i].job_title,
          value: result[i].id
        });
    }
  });
  db.query("SELECT * FROM employees", function (err, result, fields) {
    for (i=0; i < length(result); i++) {
      employeesChoices.push({
          name: result[i].first_name + ' ' + result[i].last_name,
          value: result[i].id
        });
    };
    if (err) {
      console.log(err);
    }
  });
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'newEmployeeFN'
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'newEmployeeLN'
      },
      {
        type: 'list',
        message: "What is the employee's role?",
        name: 'newEmployeeRole',
        choices: rolesChoices
      },
      {
        type: 'list',
        message: "Who is the employee's manager?",
        name: 'newEmployeeManager',
        choices: employeesChoices
      }     
    ]).then((response) => {
      const sql = `INSERT INTO employees (first_name, last_name, job_title, manager)
      VALUES (?)`;
      const params = [response.newEmployeeFN, response.newEmployeeLN, response.newEmployeeRole.value, response.newEmployeeManager.value];
      console.log('Adding new employee to database.')
      db.query(sql, params, (error, result) => {
        if (error) throw error;
        cconsole.log(`Added ${response.newEmployeeFN} ${response.newEmployeeLN} to the database.`);;
        return mainMenu()
      })
    });
}

function updateRole() {
  let rolesChoices = [];
  let employeesChoices = [];
  db.query("SELECT * FROM roles", function (err, result, fields) {
    for (i=0; i < length(result); i++) {
      rolesChoices.push({
          name: result[i].job_title,
          value: result[i].id
        });
    }
    if (err) {
      console.log(err);
    }
  });
  db.query("SELECT * FROM employees", function (err, result, fields) {
    for (i=0; i < length(result); i++) {
      employeesChoices.push({
          name: result[i].first_name + ' ' + result[i].last_name,
          value: result[i].id
        })  
    };
    if (err) {
      console.log(err);
    }
  });
  inquirer
    .prompt([
      {
        type: 'input',
        message: "Which employee's role would you like to update?",
        name: 'updatedEmployee',
        choices: employeesChoices
      },
      {
        type: 'input',
        message: "Which role would you like to assign the selected employee?",
        name: 'updatedRole',
        choices: rolesChoices
      }     
    ]).then((response) => {
      const sql = `UPDATE employees
      SET job_title = (?)
      WHERE id = (?)`;
      const params = [response.updatedRole.value, response.updatedEmployee.value];
      console.log('Changing employee role...')
      db.query(sql, params, (error, result) => {
        if (error) throw error;
        console.table(result);
        return mainMenu()
      })
    });
}

function quitApp() {
  const sql = `quit`
  db.query(sql, (error, result) => {
    if (error) throw error;
    console.table(result);
    return mainMenu()
  })
}

mainMenu();
