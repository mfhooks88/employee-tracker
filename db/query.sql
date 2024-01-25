-- Get all employees in a specific department
SELECT * FROM employee
WHERE role_id IN (SELECT id FROM role WHERE department_id = :departmentId);

-- Get employees managed by a specific manager
SELECT * FROM employee
WHERE manager_id = :managerId;

-- Get the total utilized budget of a department
SELECT department.name AS department_name, SUM(role.salary) AS total_budget
FROM department
JOIN role ON role.department_id = department.id
GROUP BY department.id;
