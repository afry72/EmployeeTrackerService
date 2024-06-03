INSERT INTO department (dep_name)
VALUES ("admin"),
       ("HR"),
       ("IT"),
       ("Development"),
       ("Accounting");

INSERT INTO job (title, wage, dep_id)
VALUES ("CEO", 84.50, 1),
       ("designer", 40.10, 4),
       ("engineer", 50.40, 4),
       ("HR Rep", 45.50, 2),
       ("IT Lead", 45.50, 3);

INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES ("john", "smith", 1, true),
       ("Amira", "Afzal", 2, false),
       ("Christoper", "Lee", 3, false),
       ("Veronica", "Rodriguez", 5, true),
       ("Igor", "Stein", 4, false);
