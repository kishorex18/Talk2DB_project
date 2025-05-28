-- Create the database
CREATE DATABASE example_db;

-- Use the database
USE example_db;

-- Students table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    department VARCHAR(50)
);

-- Marks table
CREATE TABLE marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(50),
    score INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Staff table
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(50),
    subject VARCHAR(50)
);

-- Insert sample data
INSERT INTO students (name, age, gender, department) VALUES
('Alice', 20, 'Female', 'CSE'),
('Bob', 21, 'Male', 'ECE'),
('Charlie', 22, 'Male', 'ME');

INSERT INTO marks (student_id, subject, score) VALUES
(1, 'Math', 85),
(1, 'English', 78),
(2, 'Math', 92),
(3, 'English', 88);

INSERT INTO staff (name, role, subject) VALUES
('Dr. Smith', 'Professor', 'Math'),
('Ms. Jane', 'Lecturer', 'English');
SELECT * FROM department