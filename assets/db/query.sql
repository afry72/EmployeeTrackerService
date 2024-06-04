SELECT * FROM departments;

SELECT e.id, e.first_name, e.last_name, j.title AS job_title, j.wage
FROM employee e
JOIN job j ON e.job_id = j.id;

SELECT j.id, j.title, j.wage, d.dep_name AS department_name
FROM job j
JOIN department d ON j.dep_id = d.id;
