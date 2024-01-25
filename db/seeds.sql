-- Insert departments
INSERT INTO department (id, name) VALUES
  (1, 'Sales'),
  (2, 'Marketing'),
  (3, 'Engineering');

-- Insert roles
INSERT INTO role (id, title, salary, department_id) VALUES
  (1, 'Sales Manager', 80000, 1),
  (2, 'Sales Representative', 50000, 1),
  (3, 'Marketing Manager', 75000, 2),
  (4, 'Marketing Coordinator', 45000, 2),
  (5, 'Software Engineer', 100000, 3),
  (6, 'QA Engineer', 90000, 3);

-- Insert employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'John', 'Doe', 1, NULL),
  (2, 'Jane', 'Smith', 2, 1),
  (3, 'Bob', 'Johnson', 3, NULL),
  (4, 'Alice', 'Williams', 4, 3),
  (5, 'Charlie', 'Brown', 5, NULL),
  (6, 'David', 'Jones', 6, 5);
