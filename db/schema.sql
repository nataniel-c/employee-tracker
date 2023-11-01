DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(100),
    department_id INT,
    salary VARCHAR(100),
    FOREIGN KEY (department_id) 
    REFERENCES departments(id) 
    ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) 
  REFERENCES roles(id) 
  ON DELETE SET NULL
);