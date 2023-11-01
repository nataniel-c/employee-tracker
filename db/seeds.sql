INSERT INTO departments (department)
VALUES ("Accounting"),
       ("Custodial Services"),
       ("Engineering"),
       ("Finance"),
       ("Human Resources"),
       ("IT"),
       ("Management"),
       ("Manufacturing"),
       ("Mergers and Acquisitions");
       
INSERT INTO roles (job_title, department_id, salary)
VALUES ("Accountant", 1, "90-100k/year"),
       ("Janitor", 2, "25/hr"),
       ("Software Engineer", 3, "90-100k/year"),
       ("Electrical Engineer", 3, "80-90k/year"),
       ("Mechanical Engineer", 3, "70-80k/year"),
       ("Finance Director", 4, "100-120k/year"),
       ("Human Resources Specialist", 5, "60-70k/year"),
       ("Cybersecurity Analyst", 6, "40/hr"),
       ("IT Support", 6, "30/hr"),
       ("CEO", 7, "1M/year"),
       ("VP", 7, "500k/year"),
       ("Site Manager", 7, "200k/year"),
       ("Site Supervisor", 7, "150k/year"),
       ("Manufacturing Technician", 8, "35/hr"),
       ("Manufacturing Lead", 8, "40/hr"),
       ("Mergers and Acquisitions Manager", 9, "300k/year");

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Patrick", "Bateman", 16, 5),
       ("Zach", "Hill", 14, 3),
       ("Stefan", "Burnett", 15, 14),
       ("Andy", "Morin", 14, 3),
       ("Benjamin", "Reichwald", 10, 0),
       ("Zak", "Gaterud", 11, 5),
       ("Kristin", "Hayter", 1, 15),
       ("Richard", "James", 8, 10),
       ("Daniel", "Lopatin", 9, 8),
       ("Caroline", "Polachek", 12, 5),
       ("Victoria", "LeGrande", 7, 0),
       ("Alex", "Scally", 7, 0),
       ("Aubrey", "Graham", 2, 10),
       ("Megan", "Pete", 13, 10),
       ("Jacques", "Webster", 6, 5),
       ("Sonny", "Moore", 4, 14);
       
