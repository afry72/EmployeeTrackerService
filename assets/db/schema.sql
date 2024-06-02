DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    dep_name VARCHAR(15) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE job (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(10) NOT NULL,
    wage DECIMAL NOT NULL,
    dep_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (dep_id);
    REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    job_id INT,
    manager_id BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (job_id),
    REFERENCES job(id)
);