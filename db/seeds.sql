INSERT INTO department (name)
VALUES
('Legal'),
('Accounting'),
('Engineering'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES 
('Lawyer', 100000, 1),
('Legal Team Lead', 175000, 1),
('Accountant', 30000, 2),
('Financial Analyst', 90000, 2),
('Junior Developer', 50000, 3),
('Lead Developer' 125000, 3),
('Software Engineer', 175000, 3),
('Sales Lead', 60000, 4),
('Project Manager', 85000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Jennie', 'Allen', 1, 2),
('Marcy', 'Bennet', 2, null),
('Megan', 'Smith', 4, null),
('Elise', 'Mann', 3, 3),
('Michele', 'Peters', 7, null),
('Nicole', 'Miller', 5, 5),
('Paula', 'Davidson', 6, 5),
('Bridget', 'Kennedy', 9, null),
('Tracey', 'Stevens', 8, 8);