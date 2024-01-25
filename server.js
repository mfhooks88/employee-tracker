// help was provided during tutoring session
// Import required packages
const mysql = require('mysql2');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
});

// help was provided during tutoring session
// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.message);
    return;
  }
  console.log('Connected to the database');

  // Create and use 'employee_tracker_db' database
  connection.query('CREATE DATABASE IF NOT EXISTS employee_tracker_db', (err) => {
    if (err) throw err;
    console.log('Database employee_tracker_db created or already exists');
    connection.query('USE employee_tracker_db', (err) => {
      if (err) throw err;
      console.log('Using employee_tracker_db database');

      // Execute schema.sql and seeds.sql files
      executeSqlFile('schema.sql')
        .then(() => executeSqlFile('seeds.sql'))
        .then(() => startApp())
        .catch((err) => {
          console.error('Error:', err);
          connection.end();
        });
    });
  });
});

// help was provided during tutoring session
// Function to execute SQL file
function executeSqlFile(filePath) {
  const fullPath = path.join(__dirname, 'db', filePath);
  const sql = fs.readFileSync(fullPath, 'utf8');

  // Split SQL statements by semicolon
  const statements = sql.split(';');

  // Filter out empty statements
  const nonEmptyStatements = statements.filter((statement) => statement.trim() !== '');

  // Execute each non-empty SQL statement
  return nonEmptyStatements.reduce((promise, statement) => {
    return promise.then(() => {
      return connection.promise().query(statement);
    });
  }, Promise.resolve());
}

// help was provided during tutoring session
// Function to display options and handle user input
function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        // Add cases for other options...
        case 'Exit':
          console.log('Exiting application.');
          connection.end();
          break;
      }
    });
}

// help was provided during tutoring session
// Function to handle viewing all departments
function viewAllDepartments() {
  connection
    .promise()
    .query('SELECT * FROM department')
    .then((results) => {
      console.table(results[0]);
      startApp(); // Return to main menu
    })
    .catch((err) => {
      console.error('Error viewing departments:', err);
      startApp(); // Return to main menu
    });
}

// Function to handle viewing all roles
function viewAllRoles() {
  connection
    .promise()
    .query('SELECT * FROM role')
    .then((results) => {
      console.table(results[0]);
      startApp(); // Return to main menu
    })
    .catch((err) => {
      console.error('Error viewing roles:', err);
      startApp(); // Return to main menu
    });
}

// Function to handle viewing all employees
function viewAllEmployees() {
  connection
    .promise()
    .query('SELECT * FROM employee')
    .then((results) => {
      console.table(results[0]);
      startApp(); // Return to main menu
    })
    .catch((err) => {
      console.error('Error viewing employees:', err);
      startApp(); // Return to main menu
    });
}

// help was provided during tutoring session
// Function to add a new department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const departmentName = answer.name;
      connection
        .promise()
        .query('INSERT INTO department (name) VALUES (?)', [departmentName])
        .then(() => {
          console.log(`Department "${departmentName}" added successfully!`);
          startApp(); // Restart the application
        })
        .catch((err) => {
          console.error('Error adding department:', err);
          startApp(); // Restart the application
        });
    });
}

// Function to handle adding a role
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the department ID for the role:',
      },
    ])
    .then((answers) => {
      const { title, salary, department_id } = answers;
      connection
        .promise()
        .query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id])
        .then(() => {
          console.log(`Role "${title}" added successfully!`);
          startApp(); // Return to main menu
        })
        .catch((err) => {
          console.error('Error adding role:', err);
          startApp(); // Return to main menu
        });
    });
}

// Function to handle adding an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:',
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the role ID for the employee:',
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the manager ID for the employee (optional):',
      },
    ])
    .then((answers) => {
      const { first_name, last_name, role_id, manager_id } = answers;
      
      // Convert manager_id to NULL if not provided
      const managerIdValue = manager_id || null;

      connection
        .promise()
        .query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role_id, managerIdValue])
        .then(() => {
          console.log(`Employee "${first_name} ${last_name}" added successfully!`);
          startApp(); // Return to main menu
        })
        .catch((err) => {
          console.error('Error adding employee:', err);
          startApp(); // Return to main menu
        });
    });
}

