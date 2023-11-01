-- SELECT employees.employee_name AS movie, reviews.review
-- FROM reviews
-- LEFT JOIN movies
-- ON reviews.movie_id = movies.id
-- ORDER BY movies.movie_name;
SELECT e.id,
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
ORDER BY e.id;