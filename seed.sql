USE up_skillo_db;

-- Insert Teachers (3 records)
INSERT INTO Teacher (name, email, password, join_date, bio, created_at) VALUES
('John Smith', 'john.smith@email.com', 'hashed_password_1', '2023-01-15 09:00:00', 'Experienced web developer with 10+ years in the industry', '2023-01-15 09:00:00'),
('Sarah Johnson', 'sarah.j@email.com', 'hashed_password_2', '2023-02-10 10:30:00', 'Data science expert and Python enthusiast', '2023-02-10 10:30:00'),
('Mike Chen', 'mike.chen@email.com', 'hashed_password_3', '2023-01-20 14:15:00', 'Digital marketing specialist and design guru', '2023-01-20 14:15:00');

-- Insert Students (12 records)
INSERT INTO Student (name, email, password, join_date, total_points, created_at) VALUES
('Emily Davis', 'emily.davis@email.com', 'hashed_password_4', '2023-03-05 11:00:00', 235, '2023-03-05 11:00:00'),
('Alex Rodriguez', 'alex.r@email.com', 'hashed_password_5', '2023-03-10 16:45:00', 135, '2023-03-10 16:45:00'),
('Priya Patel', 'priya.p@email.com', 'hashed_password_6', '2023-03-12 08:20:00', 25, '2023-03-12 08:20:00'),
('David Kim', 'david.kim@email.com', 'hashed_password_7', '2023-03-15 13:10:00', 150, '2023-03-15 13:10:00'),
('Lisa Wang', 'lisa.wang@email.com', 'hashed_password_8', '2023-03-18 09:30:00', 130, '2023-03-18 09:30:00'),
('James Brown', 'james.b@email.com', 'hashed_password_9', '2023-03-20 15:00:00', 100, '2023-03-20 15:00:00'),
('Maria Garcia', 'maria.g@email.com', 'hashed_password_10', '2023-03-22 10:15:00', 0, '2023-03-22 10:15:00'),
('Robert Taylor', 'robert.t@email.com', 'hashed_password_11', '2023-03-25 14:50:00', 100, '2023-03-25 14:50:00'),
('Jennifer Lee', 'jennifer.lee@email.com', 'hashed_password_12', '2023-03-28 12:30:00', 100, '2023-03-28 12:30:00'),
('Kevin Martin', 'kevin.m@email.com', 'hashed_password_13', '2023-04-01 11:20:00', 100, '2023-04-01 11:20:00'),
('Amanda Wilson', 'amanda.w@email.com', 'hashed_password_14', '2023-04-03 16:10:00', 100, '2023-04-03 16:10:00'),
('Daniel Clark', 'daniel.c@email.com', 'hashed_password_15', '2023-04-05 09:45:00', 0, '2023-04-05 09:45:00');

-- Insert Courses (12 records)
INSERT INTO Course (title, description, category, teacher_id, created_at, filename) VALUES
('Web Development Fundamentals', 'Learn HTML, CSS, and JavaScript from scratch', 'Programming', 1, '2023-02-01 10:00:00', 'web_dev_fundamentals.pdf'),
('Data Science with Python', 'Master data analysis and visualization with Python', 'Data Science', 2, '2023-02-05 14:30:00', 'data_science_python.pdf'),
('Mobile App Development', 'Build cross-platform mobile applications', 'Programming', 1, '2023-02-10 11:15:00', 'mobile_app_dev.pdf'),
('Digital Marketing Strategies', 'Learn modern digital marketing techniques', 'Marketing', 3, '2023-02-15 09:45:00', 'digital_marketing.pdf'),
('Machine Learning Basics', 'Introduction to ML algorithms and applications', 'Data Science', 2, '2023-02-20 13:20:00', 'ml_basics.pdf'),
('Graphic Design Principles', 'Fundamentals of visual design and composition', 'Design', 3, '2023-02-25 15:30:00', 'graphic_design.pdf'),
('Database Management Systems', 'Complete guide to SQL and database design', 'Programming', 1, '2023-03-01 08:50:00', 'database_systems.pdf'),
('Business Analytics', 'Data-driven decision making for business', 'Business', 2, '2023-03-05 12:10:00', 'business_analytics.pdf'),
('UI/UX Design Masterclass', 'User-centered design principles and practices', 'Design', 3, '2023-03-10 16:25:00', 'uiux_design.pdf'),
('Cloud Computing Fundamentals', 'Introduction to AWS and cloud services', 'IT', 1, '2023-03-15 10:40:00', 'cloud_computing.pdf'),
('Project Management', 'Agile and traditional project management methods', 'Business', 2, '2023-03-20 14:55:00', 'project_management.pdf'),
('Cybersecurity Essentials', 'Protect systems and networks from threats', 'IT', 3, '2023-03-25 11:05:00', 'cybersecurity.pdf');

-- Insert Content (Lessons) (15 records)
INSERT INTO Content (course_id, lesson_title, description, filename, created_at) VALUES
(1, 'HTML Basics', 'Introduction to HTML structure and tags', 'html_basics.mp4', '2023-02-02 10:00:00'),
(1, 'CSS Styling', 'Learn CSS for beautiful web pages', 'css_styling.mp4', '2023-02-02 11:00:00'),
(1, 'JavaScript Fundamentals', 'Programming basics with JavaScript', 'js_fundamentals.mp4', '2023-02-02 12:00:00'),
(2, 'Python for Data Analysis', 'Pandas and NumPy introduction', 'python_data.pdf', '2023-02-06 10:00:00'),
(2, 'Data Visualization', 'Creating charts with Matplotlib', 'data_viz.mp4', '2023-02-06 11:00:00'),
(3, 'React Native Setup', 'Setting up development environment', 'react_setup.pdf', '2023-02-11 10:00:00'),
(3, 'Building First App', 'Create your first mobile application', 'first_app.mp4', '2023-02-11 11:00:00'),
(4, 'SEO Fundamentals', 'Search Engine Optimization basics', 'seo_basics.mp4', '2023-02-16 10:00:00'),
(5, 'Linear Regression', 'Understanding regression models', 'linear_regression.pdf', '2023-02-21 10:00:00'),
(6, 'Color Theory', 'Principles of color in design', 'color_theory.mp4', '2023-02-26 10:00:00'),
(7, 'SQL Queries', 'Writing efficient database queries', 'sql_queries.mp4', '2023-03-02 10:00:00'),
(8, 'Business Metrics', 'Key performance indicators', 'business_metrics.pdf', '2023-03-06 10:00:00'),
(9, 'User Research', 'Conducting effective user research', 'user_research.mp4', '2023-03-11 10:00:00'),
(10, 'AWS Services', 'Overview of Amazon Web Services', 'aws_services.pdf', '2023-03-16 10:00:00'),
(11, 'Agile Methodology', 'Implementing Agile in projects', 'agile_methodology.mp4', '2023-03-21 10:00:00');

-- Insert Enrollments (15 records)
INSERT INTO Enrollment (student_id, course_id, enrolled_at, completion_percentage) VALUES
(1, 1, '2023-03-06 10:00:00', 100),
(1, 2, '2023-03-07 11:30:00', 50),
(2, 1, '2023-03-11 14:20:00', 67),
(2, 3, '2023-03-12 09:15:00', 50),
(3, 4, '2023-03-13 16:45:00', 100),
(4, 2, '2023-03-16 13:10:00', 100),
(4, 5, '2023-03-17 08:30:00', 100),
(5, 1, '2023-03-19 15:20:00', 67),
(5, 6, '2023-03-20 11:40:00', 100),
(6, 3, '2023-03-21 10:15:00', 50),
(7, 7, '2023-03-23 14:50:00', 100),
(8, 8, '2023-03-26 12:25:00', 100),
(9, 9, '2023-03-29 09:35:00', 100),
(10, 10, '2023-04-02 16:10:00', 100),
(11, 11, '2023-04-04 13:45:00', 100);

-- Insert Lesson Completions (15 records)
INSERT INTO LessonCompletion (content_id, course_id, student_id, completed_at) VALUES
(1, 1, 1, '2023-03-07 11:00:00'),
(2, 1, 1, '2023-03-08 14:30:00'),
(3, 1, 1, '2023-03-09 16:15:00'),
(1, 1, 2, '2023-03-12 16:15:00'),
(2, 1, 2, '2023-03-13 10:45:00'),
(6, 3, 2, '2023-03-14 09:20:00'),
(4, 2, 4, '2023-03-17 15:30:00'),
(5, 2, 4, '2023-03-18 11:10:00'),
(1, 1, 5, '2023-03-20 14:25:00'),
(2, 1, 5, '2023-03-21 08:50:00'),
(7, 3, 6, '2023-03-22 12:35:00'),
(11, 7, 7, '2023-03-24 16:40:00'),
(12, 8, 8, '2023-03-27 13:15:00'),
(13, 9, 9, '2023-03-30 10:05:00'),
(14, 10, 10, '2023-04-03 09:30:00');

-- Insert Course Reviews (15 records)
INSERT INTO CourseReview (course_id, student_id, review_text, rating, created_at) VALUES
(1, 1, 'Excellent course for beginners! Very comprehensive.', 5, '2023-03-10 12:00:00'),
(1, 2, 'Good content, but could use more practical examples.', 4, '2023-03-15 14:30:00'),
(2, 1, 'Amazing instructor and well-structured material.', 5, '2023-03-12 16:45:00'),
(2, 4, 'Challenging but rewarding course.', 4, '2023-03-20 10:15:00'),
(3, 2, 'Perfect for mobile development beginners.', 5, '2023-03-18 13:20:00'),
(4, 3, 'Useful marketing insights and strategies.', 4, '2023-03-16 15:40:00'),
(5, 4, 'Great introduction to machine learning concepts.', 5, '2023-03-22 11:25:00'),
(6, 5, 'Beautiful design principles explained clearly.', 4, '2023-03-25 09:50:00'),
(7, 7, 'Database concepts made easy to understand.', 5, '2023-03-28 14:10:00'),
(8, 8, 'Practical business analytics techniques.', 4, '2023-04-01 16:30:00'),
(9, 9, 'Outstanding UI/UX design course!', 5, '2023-04-03 12:45:00'),
(10, 10, 'Good overview of cloud computing.', 4, '2023-04-06 08:20:00'),
(11, 11, 'Project management skills immediately applicable.', 5, '2023-04-08 15:55:00'),
(1, 5, 'Content was good but pace was too fast.', 3, '2023-03-22 17:10:00'),
(3, 6, 'Loved building my first mobile app!', 5, '2023-03-24 13:40:00');

-- Insert Achievements (15 records)
INSERT INTO Achievement (name, description, points, badge_image, student_id, earned_at) VALUES
('First Lesson Completed', 'Completed your first lesson', 10, 'first_lesson.png', 1, '2023-03-07 11:00:00'),
('Course Explorer', 'Enrolled in 2 courses', 25, 'explorer.png', 1, '2023-03-07 11:30:00'),
('Quick Learner', 'Completed 5 lessons', 50, 'quick_learner.png', 1, '2023-03-10 14:20:00'),
('Web Developer', 'Completed Web Development course', 100, 'web_dev.png', 2, '2023-03-20 16:45:00'),
('Data Analyst', 'Mastered data analysis skills', 100, 'data_analyst.png', 4, '2023-03-25 10:15:00'),
('Perfect Score', 'Received 5-star rating on review', 30, 'perfect_score.png', 1, '2023-03-10 12:00:00'),
('Mobile Guru', 'Completed mobile development course', 100, 'mobile_guru.png', 6, '2023-03-28 13:20:00'),
('Design Master', 'Excelled in design principles', 100, 'design_master.png', 5, '2023-03-30 09:45:00'),
('Database Expert', 'Mastered database management', 100, 'db_expert.png', 7, '2023-04-02 15:10:00'),
('Business Pro', 'Completed business analytics course', 100, 'business_pro.png', 8, '2023-04-05 11:35:00'),
('Cloud Specialist', 'Learned cloud computing fundamentals', 100, 'cloud_specialist.png', 10, '2023-04-08 14:50:00'),
('Project Manager', 'Mastered project management', 100, 'project_manager.png', 11, '2023-04-10 12:25:00'),
('Consistent Learner', 'Completed 10 lessons', 75, 'consistent.png', 1, '2023-03-25 16:40:00'),
('Review Contributor', 'Posted 5 course reviews', 40, 'reviewer.png', 1, '2023-04-01 10:05:00'),
('Community Helper', 'Active in forum discussions', 35, 'community.png', 2, '2023-03-30 13:15:00');

-- Insert Recommendation Feedback (15 records)
INSERT INTO RecommendationFeedback (student_id, course_id, feedback, created_at) VALUES
(1, 3, 'like', '2023-03-09 11:20:00'),
(1, 7, 'dislike', '2023-03-11 14:45:00'),
(2, 2, 'like', '2023-03-13 09:30:00'),
(2, 6, 'like', '2023-03-14 16:10:00'),
(3, 5, 'dislike', '2023-03-15 12:25:00'),
(4, 8, 'like', '2023-03-19 15:40:00'),
(5, 4, 'like', '2023-03-21 10:55:00'),
(6, 10, 'dislike', '2023-03-23 13:20:00'),
(7, 9, 'like', '2023-03-26 08:45:00'),
(8, 11, 'like', '2023-03-28 14:30:00'),
(9, 12, 'dislike', '2023-03-31 11:05:00'),
(10, 1, 'like', '2023-04-04 16:50:00'),
(11, 3, 'like', '2023-04-06 09:15:00'),
(1, 8, 'like', '2023-03-20 12:40:00'),
(2, 9, 'dislike', '2023-03-22 15:25:00');

-- Insert Forum Posts (15 records)
INSERT INTO ForumPost (course_id, author_type, author_id, title, body, created_at) VALUES
(1, 'student', 1, 'Help with CSS flexbox', 'I am having trouble understanding flexbox alignment. Can anyone help?', '2023-03-08 10:30:00'),
(1, 'student', 2, 'JavaScript project ideas', 'Looking for beginner-friendly JavaScript project suggestions.', '2023-03-13 14:20:00'),
(2, 'student', 4, 'Pandas dataframe issue', 'Getting error when merging dataframes. Any solutions?', '2023-03-18 16:45:00'),
(3, 'student', 6, 'React Native setup problem', 'Cannot install React Native dependencies on Windows.', '2023-03-22 09:15:00'),
(4, 'student', 3, 'SEO best practices 2023', 'What are the latest SEO techniques that actually work?', '2023-03-16 11:40:00'),
(5, 'student', 4, 'Linear regression assumptions', 'Can someone explain the assumptions behind linear regression?', '2023-03-21 13:25:00'),
(6, 'student', 5, 'Color palette tools', 'What are your favorite tools for creating color palettes?', '2023-03-24 15:50:00'),
(7, 'student', 7, 'SQL query optimization', 'How can I optimize slow-running SQL queries?', '2023-03-27 12:05:00'),
(8, 'student', 8, 'Business metrics for startups', 'Which metrics are most important for early-stage startups?', '2023-03-30 14:30:00'),
(9, 'student', 9, 'User testing methods', 'What are the most effective user testing methods?', '2023-04-02 10:55:00'),
(10, 'student', 10, 'AWS free tier limits', 'What are the exact limits of AWS free tier?', '2023-04-05 16:20:00'),
(11, 'student', 11, 'Agile vs Waterfall', 'When to choose Agile over Waterfall methodology?', '2023-04-07 08:45:00'),
(2, 'student', 1, 'Matplotlib customization', 'How to customize matplotlib charts for publications?', '2023-03-15 17:10:00'),
(1, 'student', 5, 'HTML semantic elements', 'Best practices for using semantic HTML elements?', '2023-03-19 11:35:00'),
(3, 'student', 2, 'State management in React Native', 'What state management solution do you recommend for React Native?', '2023-03-25 13:00:00');

-- Insert Forum Replies (15 records)
INSERT INTO ForumReply (post_id, author_type, author_id, reply_body, created_at) VALUES
(1, 'student', 2, 'Try using justify-content and align-items properties for flex container.', '2023-03-08 11:45:00'),
(1, 'teacher', 1, 'Check out the CSS Tricks flexbox guide - it is very comprehensive!', '2023-03-08 14:20:00'),
(2, 'student', 1, 'You can start with a todo app or a weather application.', '2023-03-13 15:30:00'),
(3, 'teacher', 2, 'Make sure your column names match exactly when merging.', '2023-03-18 17:15:00'),
(4, 'teacher', 1, 'Try running the command prompt as administrator.', '2023-03-22 10:25:00'),
(5, 'teacher', 3, 'Focus on Core Web Vitals and quality content in 2023.', '2023-03-16 13:50:00'),
(6, 'teacher', 2, 'The main assumptions are linearity, independence, and homoscedasticity.', '2023-03-21 14:35:00'),
(7, 'teacher', 3, 'I recommend Coolors.co and Adobe Color for palette generation.', '2023-03-24 16:10:00'),
(8, 'teacher', 1, 'Use EXPLAIN to analyze query performance and add indexes.', '2023-03-27 13:15:00'),
(9, 'teacher', 2, 'MRR, CAC, LTV, and churn rate are crucial for startups.', '2023-03-30 15:40:00'),
(10, 'teacher', 3, 'Usability testing and A/B testing are very effective.', '2023-04-02 12:05:00'),
(11, 'teacher', 1, 'Free tier includes 750hrs EC2, 5GB S3 for 12 months.', '2023-04-05 17:30:00'),
(12, 'teacher', 2, 'Agile for changing requirements, Waterfall for fixed scope.', '2023-04-07 09:55:00'),
(13, 'student', 4, 'You can use plt.style for different themes and customizations.', '2023-03-15 18:20:00'),
(14, 'student', 2, 'Use header, nav, main, article, section, and footer appropriately.', '2023-03-19 12:45:00');

-- Insert Payments (15 records)
INSERT INTO Payment (amount, currency, created_at, provider, transaction_id, status, student_id, course_id) VALUES
(110.00, 'USD', '2023-03-06 10:00:00', 'stripe', 'txn_001stripe2023', 'succeeded', 1, 1),
(150.00, 'USD', '2023-03-07 11:30:00', 'stripe', 'txn_002stripe2023', 'succeeded', 1, 2),
(110.00, 'USD', '2023-03-11 14:20:00', 'paypal', 'txn_003paypal2023', 'succeeded', 2, 1),
(130.00, 'USD', '2023-03-12 09:15:00', 'stripe', 'txn_004stripe2023', 'succeeded', 2, 3),
(120.00, 'PKR', '2023-03-13 16:45:00', 'paypal', 'txn_005paypal2023', 'succeeded', 3, 4),
(150.00, 'USD', '2023-03-16 13:10:00', 'stripe', 'txn_006stripe2023', 'succeeded', 4, 2),
(160.00, 'USD', '2023-03-17 08:30:00', 'paypal', 'txn_007paypal2023', 'succeeded', 4, 5),
(110.00, 'USD', '2023-03-19 15:20:00', 'stripe', 'txn_008stripe2023', 'succeeded', 5, 1),
(120.00, 'USD', '2023-03-20 11:40:00', 'paypal', 'txn_009paypal2023', 'succeeded', 5, 6),
(130.00, 'USD', '2023-03-21 10:15:00', 'stripe', 'txn_010stripe2023', 'succeeded', 6, 3),
(140.00, 'PKR', '2023-03-23 14:50:00', 'paypal', 'txn_011paypal2023', 'succeeded', 7, 7),
(120.00, 'USD', '2023-03-26 12:25:00', 'stripe', 'txn_012stripe2023', 'succeeded', 8, 8),
(170.00, 'USD', '2023-03-29 09:35:00', 'paypal', 'txn_013paypal2023', 'succeeded', 9, 9),
(150.00, 'USD', '2023-04-02 16:10:00', 'stripe', 'txn_014stripe2023', 'succeeded', 10, 10),
(130.00, 'USD', '2023-04-04 13:45:00', 'paypal', 'txn_015paypal2023', 'succeeded', 11, 11);