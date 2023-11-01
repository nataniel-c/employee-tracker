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
    })
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
  ON e.role_id = r.id
  INNER JOIN departments
  ON r.department_id = departments.id
  LEFT JOIN employees
  ON e.manager_id = employees.id
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
  db.query("SELECT * FROM departments", (error, results, fields) => {
    if (error) throw error;
    const departmentsChoices = results.map((currentValue, index, array) => {
      return { name: currentValue.department, value: currentValue.id }
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
      ])
      .then((response) => {
        const sql = `INSERT INTO roles (job_title, department_id, salary)
        VALUES (?, ?, ?)`;
        const params = [response.newRole, response.newRoleDepartment, response.newRoleSalary];
        db.query(sql, params, (error, results) => {
          if (error) throw error;
          console.log(`Added ${response.newRole} to Roles.`);
          return mainMenu()
        })
      })
    })
}

function addEmployee() {
  db.query("SELECT * FROM roles", (error, results, fields) => {
    if (error) throw error;
    var rolesChoices = results.map((currentValue, index, array) => {
      return { name: currentValue.job_title, value: currentValue.id }
    });
    db.query("SELECT * FROM employees", (error, results, fields) => {
      if (error) throw error;
      const employeesChoices = results.map((currentValue, index, array) => {
        return { name: currentValue.first_name + ' ' + currentValue.last_name, value: currentValue.id }
      })
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
        ])
        .then((response) => {
          const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?)`;
          const params = [response.newEmployeeFN, response.newEmployeeLN, response.newEmployeeRole, response.newEmployeeManager];
          db.query(sql, params, (error, result) => {
            if (error) throw error;
            console.log(`Added ${response.newEmployeeFN} ${response.newEmployeeLN} to the database.`);
            return mainMenu()
          })
        });
      })
  })
}

function updateRole() {
  db.query("SELECT * FROM roles", (error, results, fields) => {
    if (error) throw error;
    var rolesChoices = results.map((currentValue, index, array) => {
      return { name: currentValue.job_title, value: currentValue.id }
    });
    db.query("SELECT * FROM employees", (error, results, fields) => {
      if (error) throw error;
      const employeesChoices = results.map((currentValue, index, array) => {
        return { name: currentValue.first_name + ' ' + currentValue.last_name, value: currentValue.id }
      })
      inquirer
        .prompt([
          {
            type: 'list',
            message: "Which employee's role would you like to update?",
            name: 'updatedEmployee',
            choices: employeesChoices
          },
          {
            type: 'list',
            message: "Which role would you like to assign the selected employee?",
            name: 'updatedRole',
            choices: rolesChoices
          }     
        ]).then((response) => {
          const sql = `UPDATE employees
          SET role_id = (?)
          WHERE id = (?)`;
          const params = [response.updatedRole, response.updatedEmployee];
          db.query(sql, params, (error, result) => {
            if (error) throw error;
            console.log(`Changed ${employeesChoices[response.updatedEmployee - 1].name}'s job to ${rolesChoices[response.updatedRole - 1].name}`);
            return mainMenu()
          })
        });
      })
  })
}

function quitApp() {
  const sql = `quit`
  db.query(sql, (error, result) => {
    if (error) throw error;
  })
}

mainMenu();
