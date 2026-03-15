-- drop database if exists up_skillo_db;
-- Database creation
CREATE DATABASE IF NOT EXISTS up_skillo_db;
USE up_skillo_db;

-- Student table
CREATE TABLE Student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_points INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teacher table
CREATE TABLE Teacher (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Course table with teacher reference and filename
CREATE TABLE Course (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    teacher_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    filename VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES Teacher(id) ON DELETE CASCADE
);

-- Content (Lesson) table
CREATE TABLE Content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);

-- Enrollment table
CREATE TABLE Enrollment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completion_percentage INT DEFAULT 0,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);

-- Lesson Completion tracking
CREATE TABLE LessonCompletion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES Content(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
);

-- Course Reviews
CREATE TABLE CourseReview (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    review_text TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_review (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);

-- Achievements system
CREATE TABLE Achievement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points INT DEFAULT 0,
    badge_image VARCHAR(255),
    student_id INT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
);

-- Recommendation feedback
CREATE TABLE RecommendationFeedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    feedback ENUM('like', 'dislike') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);

-- Forum system
CREATE TABLE ForumPost (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    author_type ENUM('student', 'teacher') NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);

CREATE TABLE ForumReply (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    author_type ENUM('student', 'teacher') NOT NULL,
    author_id INT NOT NULL,
    reply_body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES ForumPost(id) ON DELETE CASCADE
);

-- Payment system
CREATE TABLE Payment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(10,2) NOT NULL,
    currency ENUM('USD', 'PKR') DEFAULT 'USD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(100),
    transaction_id VARCHAR(255) UNIQUE,
    status ENUM('pending', 'succeeded', 'failed', 'refunded') DEFAULT 'pending',
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);