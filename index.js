// index.js
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var path = require("path");

var app = express();
var connection = require('./database');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'up_skillo_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set view engine to JSX-like templates (using EJS for simplicity)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Serve static files
app.use(express.static('public'));

// Database connection
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database: ', err);
        throw err; 
    }
    console.log('Database connected!');
});

// Helper function to update completion percentage
function updateCompletionPercentage(studentId, courseId) {
    const progressSql = `
        SELECT 
            (SELECT COUNT(*) FROM Content WHERE course_id = ?) as total_lessons,
            (SELECT COUNT(*) FROM LessonCompletion WHERE student_id = ? AND course_id = ?) as completed_lessons
    `;
    
    connection.query(progressSql, [courseId, studentId, courseId], function (err, results) {
        if (!err && results.length > 0) {
            const progress = results[0];
            const percentage = progress.total_lessons > 0 ? 
                Math.round((progress.completed_lessons / progress.total_lessons) * 100) : 0;
            
            const updateSql = 'UPDATE Enrollment SET completion_percentage = ? WHERE student_id = ? AND course_id = ?';
            connection.query(updateSql, [percentage, studentId, courseId]);
        }
    });
}

// Routes

// Home page - shows login and signup button
app.get('/', function(req, res) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('home', { error: null });
});

// Login page
app.get('/login', function(req, res) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

// Signup page
app.get('/signup', function(req, res) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('signup', { error: null });
});

// Login handler
app.post('/login', async function(req, res) {
    const { email, password, userType } = req.body;
    
    try {
        let table = userType === 'teacher' ? 'Teacher' : 'Student';
        const sql = `SELECT * FROM ${table} WHERE email = ?`;
        
        connection.query(sql, [email], async function (err, results) {
            if (err) {
                console.error('Login error:', err);
                return res.render('login', { error: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.render('login', { error: 'User not found' });
            }
            
            const user = results[0];
            // For demo, using simple comparison. In production, use bcrypt
            // const validPassword = await bcrypt.compare(password, user.password);
            const validPassword = (password === user.password); // Temporary simple check
            
            if (validPassword) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    type: userType,
                    table: table
                };
                res.redirect('/dashboard');
            } else {
                res.render('login', { error: 'Invalid password' });
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'Login failed' });
    }
});

// Signup handler
app.post('/signup', async function(req, res) {
    const { name, email, password, userType } = req.body;
    
    try {
        let table = userType === 'teacher' ? 'Teacher' : 'Student';
        
        // Check if user already exists
        const checkSql = `SELECT id FROM ${table} WHERE email = ?`;
        connection.query(checkSql, [email], function (err, results) {
            if (err) {
                console.error('Signup error:', err);
                return res.render('signup', { error: 'Database error' });
            }
            
            if (results.length > 0) 
            {
                return res.render('signup', { error: 'User already exists' });
            }
            
            // Insert new user
            const insertSql = `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?)`;
            connection.query(insertSql, [name, email, password], function (err, results) {
                if (err) {
                    console.error('Signup error:', err);
                    return res.render('signup', { error: 'Registration failed' });
                }
                
                req.session.user = {
                    id: results.insertId,
                    name: name,
                    email: email,
                    type: userType,
                    table: table
                };
                res.redirect('/dashboard');
            });
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', { error: 'Registration failed' });
    }
});

// Dashboard
app.get('/dashboard', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    let courseSql = '';
    let courseParams = [];
    
    if (req.session.user.type === 'student') {
        courseSql = `
            SELECT c.*, t.name as teacher_name 
            FROM Course c 
            JOIN Teacher t ON c.teacher_id = t.id 
            WHERE c.id IN (SELECT course_id FROM Enrollment WHERE student_id = ?)
        `;
        courseParams = [req.session.user.id];
    } else {
        courseSql = `
            SELECT c.*, t.name as teacher_name 
            FROM Course c 
            JOIN Teacher t ON c.teacher_id = t.id 
            WHERE c.teacher_id = ?
        `;
        courseParams = [req.session.user.id];
    }
    
    connection.query(courseSql, courseParams, function (err, courses) {
        if (err) {
            console.error('Dashboard error:', err);
            return res.render('dashboard', { 
                user: req.session.user, 
                courses: [],
                error: 'Failed to load courses'
            });
        }
        
        res.render('dashboard', { 
            user: req.session.user, 
            courses: courses,
            error: null
        });
    });
});

// Courses page
app.get('/courses', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    const sql = `
        SELECT c.*, t.name as teacher_name, 
               (SELECT AVG(rating) FROM CourseReview WHERE course_id = c.id) as avg_rating
        FROM Course c 
        JOIN Teacher t ON c.teacher_id = t.id
    `;
    
    connection.query(sql, function (err, courses) {
        if (err) {
            console.error('Courses error:', err);
            return res.render('courses', { 
                user: req.session.user, 
                courses: [],
                error: 'Failed to load courses'
            });
        }
        
        res.render('courses', { 
            user: req.session.user, 
            courses: courses,
            error: null
        });
    });
});

// Course creation page (for teachers only)
app.get('/create-course', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'teacher') {
        return res.redirect('/dashboard');
    }
    
    res.render('create-course', { 
        user: req.session.user, 
        error: null,
        success: null
    });
});

// Handle course creation
app.post('/create-course', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'teacher') {
        return res.redirect('/dashboard');
    }
    
    const { title, description, category, filename } = req.body;
    
    // Validate required fields
    if (!title || !description || !category) {
        return res.render('create-course', { 
            user: req.session.user, 
            error: 'Title, description and category are required',
            success: null
        });
    }
    
    const sql = 'INSERT INTO Course (title, description, category, teacher_id, filename) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(sql, [title, description, category, req.session.user.id, filename], function (err, results) {
        if (err) {
            console.error('Course creation error:', err);
            return res.render('create-course', { 
                user: req.session.user, 
                error: 'Failed to create course',
                success: null
            });
        }
        
        res.render('create-course', { 
            user: req.session.user, 
            error: null,
            success: 'Course created successfully!'
        });
    });
});

// View teacher's courses with management options
app.get('/my-courses', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'teacher') {
        return res.redirect('/dashboard');
    }
    
    const sql = `
        SELECT c.*, 
               COUNT(DISTINCT e.id) as enrollment_count,
               COUNT(DISTINCT cont.id) as content_count
        FROM Course c 
        LEFT JOIN Enrollment e ON c.id = e.course_id
        LEFT JOIN Content cont ON c.id = cont.course_id
        WHERE c.teacher_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
    `;
    
    connection.query(sql, [req.session.user.id], function (err, courses) {
        if (err) {
            console.error('My courses error:', err);
            return res.render('my-courses', { 
                user: req.session.user, 
                courses: [],
                error: 'Failed to load courses'
            });
        }
        
        res.render('my-courses', { 
            user: req.session.user, 
            courses: courses,
            error: null
        });
    });
});

// Add content to a course
app.get('/add-lesson/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'teacher') {
        return res.redirect('/dashboard');
    }
    
    const courseId = req.params.courseId;
    
    // Verify the course belongs to the teacher
    const verifySql = 'SELECT * FROM Course WHERE id = ? AND teacher_id = ?';
    connection.query(verifySql, [courseId, req.session.user.id], function (err, results) {
        if (err || results.length === 0) {
            return res.redirect('/my-courses');
        }
        
        res.render('add-lesson', { 
            user: req.session.user, 
            course: results[0],
            error: null,
            success: null
        });
    });
});

app.post('/add-lesson/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'teacher') {
        return res.redirect('/dashboard');
    }
    
    const courseId = req.params.courseId;
    const { lesson_title, description, filename } = req.body;
    
    // Validate required fields
    if (!lesson_title) {
        return res.render('add-lesson', { 
            user: req.session.user, 
            course: { id: courseId },
            error: 'Lesson title is required',
            success: null
        });
    }
    
    // Verify the course belongs to the teacher
    const verifySql = 'SELECT * FROM Course WHERE id = ? AND teacher_id = ?';
    connection.query(verifySql, [courseId, req.session.user.id], function (err, results) {
        if (err || results.length === 0) {
            return res.redirect('/my-courses');
        }
        
        const insertSql = 'INSERT INTO Content (course_id, lesson_title, description, filename) VALUES (?, ?, ?, ?)';
        
        connection.query(insertSql, [courseId, lesson_title, description, filename], function (err, lessonResults) {
            if (err) {
                console.error('Content creation error:', err);
                return res.render('add-lesson', { 
                    user: req.session.user, 
                    course: results[0],
                    error: 'Failed to add content',
                    success: null
                });
            }
            
            res.render('add-lesson', { 
                user: req.session.user, 
                course: results[0],
                error: null,
                success: 'Content added successfully!'
            });
        });
    });
});

// Enrollment and Payment routes

// Enroll in a course (shows payment page)
app.get('/enroll/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'student') {
        return res.redirect('/dashboard');
    }
    
    const courseId = req.params.courseId;
    
    const sql = `
        SELECT c.*, t.name as teacher_name 
        FROM Course c 
        JOIN Teacher t ON c.teacher_id = t.id 
        WHERE c.id = ?
    `;
    
    connection.query(sql, [courseId], function (err, results) {
        if (err || results.length === 0) {
            console.error('Course not found:', err);
            return res.redirect('/courses');
        }
        
        const course = results[0];
        
        // Check if already enrolled
        const checkEnrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
        connection.query(checkEnrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
            if (err) {
                console.error('Enrollment check error:', err);
                return res.redirect('/courses');
            }
            
            if (enrollmentResults.length > 0) {
                return res.redirect('/course/' + courseId);
            }
            
            res.render('enroll', { 
                user: req.session.user, 
                course: course,
                error: null
            });
        });
    });
});

// Process enrollment and payment
app.post('/process-enrollment', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'student') {
        return res.redirect('/dashboard');
    }
    
    const { course_id, payment_method, card_number, expiry_date, cvv, currency, amount } = req.body;
    
    // Validate payment details (simplified for demo)
    if (!payment_method || !card_number || !expiry_date || !cvv || !amount) {
        const courseSql = 'SELECT * FROM Course WHERE id = ?';
        connection.query(courseSql, [course_id], function (err, courseResults) {
            if (err || courseResults.length === 0) {
                return res.redirect('/courses');
            }
            
            res.render('enroll', { 
                user: req.session.user, 
                course: courseResults[0],
                error: 'Please fill all payment details including amount'
            });
        });
        return;
    }
    
    // Get course details
    const courseSql = 'SELECT * FROM Course WHERE id = ?';
    connection.query(courseSql, [course_id], function (err, courseResults) {
        if (err || courseResults.length === 0) {
            return res.redirect('/courses');
        }
        
        const course = courseResults[0];
        
        // Start transaction
        connection.beginTransaction(function(err) {
            if (err) {
                console.error('Transaction error:', err);
                return res.redirect('/courses');
            }
            
            // Create payment record
            const paymentSql = `
                INSERT INTO Payment (student_id, course_id, amount, currency, status, provider, transaction_id) 
                VALUES (?, ?, ?, ?, 'succeeded', ?, ?)
            `;
            const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            connection.query(paymentSql, [
                req.session.user.id, 
                course_id, 
                amount, 
                currency || 'USD',
                payment_method,
                transactionId
            ], function (err, paymentResults) {
                if (err) {
                    return connection.rollback(function() {
                        console.error('Payment error:', err);
                        res.render('enroll', { 
                            user: req.session.user, 
                            course: course,
                            error: 'Payment failed. Please try again.'
                        });
                    });
                }
                
                // Create enrollment record
                const enrollmentSql = 'INSERT INTO Enrollment (student_id, course_id) VALUES (?, ?)';
                connection.query(enrollmentSql, [req.session.user.id, course_id], function (err, enrollmentResults) {
                    if (err) {
                        return connection.rollback(function() {
                            console.error('Enrollment error:', err);
                            res.render('enroll', { 
                                user: req.session.user, 
                                course: course,
                                error: 'Enrollment failed. Please try again.'
                            });
                        });
                    }
                    
                    // Commit transaction
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                console.error('Commit error:', err);
                                res.render('enroll', { 
                                    user: req.session.user, 
                                    course: course,
                                    error: 'Transaction failed. Please try again.'
                                });
                            });
                        }
                        
                        res.redirect('/course/' + course_id);
                    });
                });
            });
        });
    });
});

// Course details page with reviews and forum
app.get('/course/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    const courseId = req.params.courseId;
    
    // Get course details
    const courseSql = `
        SELECT c.*, t.name as teacher_name, t.bio as teacher_bio,
               (SELECT AVG(rating) FROM CourseReview WHERE course_id = c.id) as avg_rating,
               (SELECT COUNT(*) FROM CourseReview WHERE course_id = c.id) as review_count
        FROM Course c 
        JOIN Teacher t ON c.teacher_id = t.id 
        WHERE c.id = ?
    `;
    
    connection.query(courseSql, [courseId], function (err, courseResults) {
        if (err || courseResults.length === 0) {
            console.error('Course not found:', err);
            return res.redirect('/courses');
        }
        
        const course = courseResults[0];
        
        // Check enrollment status
        let enrollmentSql = '';
        if (req.session.user.type === 'student') {
            enrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
        } else {
            enrollmentSql = 'SELECT * FROM Course WHERE id = ? AND teacher_id = ?';
        }
        
        connection.query(enrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
            const hasAccess = enrollmentResults.length > 0;
            
            // Get course reviews
            const reviewsSql = `
                SELECT cr.*, s.name as student_name 
                FROM CourseReview cr 
                JOIN Student s ON cr.student_id = s.id 
                WHERE cr.course_id = ? 
                ORDER BY cr.created_at DESC
            `;
            
            connection.query(reviewsSql, [courseId], function (err, reviews) {
                // Get forum posts with author names
                const forumSql = `
                    SELECT fp.*, 
                           CASE 
                               WHEN fp.author_type = 'student' THEN (SELECT name FROM Student WHERE id = fp.author_id)
                               WHEN fp.author_type = 'teacher' THEN (SELECT name FROM Teacher WHERE id = fp.author_id)
                           END as author_name,
                           (SELECT COUNT(*) FROM ForumReply WHERE post_id = fp.id) as reply_count
                    FROM ForumPost fp 
                    WHERE fp.course_id = ? 
                    ORDER BY fp.created_at DESC
                `;
                
                connection.query(forumSql, [courseId], function (err, forumPosts) {
                    // Get course content (only if has access)
                    let content = [];
                    if (hasAccess) {
                        const contentSql = 'SELECT * FROM Content WHERE course_id = ? ORDER BY created_at ASC';
                        connection.query(contentSql, [courseId], function (err, contentResults) {
                            content = contentResults || [];
                            
                            res.render('course-details', { 
                                user: req.session.user, 
                                course: course,
                                hasAccess: hasAccess,
                                reviews: reviews || [],
                                forumPosts: forumPosts || [],
                                content: content,
                                error: null
                            });
                        });
                    } else {
                        res.render('course-details', { 
                            user: req.session.user, 
                            course: course,
                            hasAccess: hasAccess,
                            reviews: reviews || [],
                            forumPosts: forumPosts || [],
                            content: [],
                            error: null
                        });
                    }
                });
            });
        });
    });
});

// Add review
app.post('/add-review/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'student') {
        return res.redirect('/course/' + req.params.courseId);
    }
    
    const courseId = req.params.courseId;
    const { rating, review_text } = req.body;
    
    // Check if user is enrolled
    const enrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
    connection.query(enrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
        if (err || enrollmentResults.length === 0) {
            return res.redirect('/course/' + courseId);
        }
        
        // Check if already reviewed
        const checkReviewSql = 'SELECT * FROM CourseReview WHERE student_id = ? AND course_id = ?';
        connection.query(checkReviewSql, [req.session.user.id, courseId], function (err, reviewResults) {
            if (reviewResults.length > 0) {
                // Update existing review
                const updateSql = 'UPDATE CourseReview SET rating = ?, review_text = ? WHERE student_id = ? AND course_id = ?';
                connection.query(updateSql, [rating, review_text, req.session.user.id, courseId], function (err) {
                    res.redirect('/course/' + courseId);
                });
            } else {
                // Insert new review
                const insertSql = 'INSERT INTO CourseReview (course_id, student_id, rating, review_text) VALUES (?, ?, ?, ?)';
                connection.query(insertSql, [courseId, req.session.user.id, rating, review_text], function (err) {
                    res.redirect('/course/' + courseId);
                });
            }
        });
    });
});

// Add forum post
app.post('/add-forum-post/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    const courseId = req.params.courseId;
    const { title, body } = req.body;
    
    // Check if user has access (enrolled for students, or teacher of course)
    let checkSql = '';
    if (req.session.user.type === 'student') {
        checkSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
    } else {
        checkSql = 'SELECT * FROM Course WHERE id = ? AND teacher_id = ?';
    }
    
    connection.query(checkSql, [req.session.user.id, courseId], function (err, checkResults) {
        if (err || checkResults.length === 0) {
            return res.redirect('/course/' + courseId);
        }
        
        const insertSql = 'INSERT INTO ForumPost (course_id, author_type, author_id, title, body) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertSql, [courseId, req.session.user.type, req.session.user.id, title, body], function (err) {
            res.redirect('/course/' + courseId);
        });
    });
});

// Add forum reply
app.post('/add-forum-reply/:postId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    const postId = req.params.postId;
    const { reply_body } = req.body;
    
    // Get course ID from post
    const postSql = 'SELECT course_id FROM ForumPost WHERE id = ?';
    connection.query(postSql, [postId], function (err, postResults) {
        if (err || postResults.length === 0) {
            return res.redirect('/courses');
        }
        
        const courseId = postResults[0].course_id;
        
        // Check if user has access
        let checkSql = '';
        if (req.session.user.type === 'student') {
            checkSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
        } else {
            checkSql = 'SELECT * FROM Course WHERE id = ? AND teacher_id = ?';
        }
        
        connection.query(checkSql, [req.session.user.id, courseId], function (err, checkResults) {
            if (err || checkResults.length === 0) {
                return res.redirect('/course/' + courseId);
            }
            
            const insertSql = 'INSERT INTO ForumReply (post_id, author_type, author_id, reply_body) VALUES (?, ?, ?, ?)';
            connection.query(insertSql, [postId, req.session.user.type, req.session.user.id, reply_body], function (err) {
                res.redirect('/course/' + courseId);
            });
        });
    });
});

// Mark content as completed
app.post('/complete-lesson/:contentId', function(req, res) {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.json({ success: false, error: 'Not authorized' });
    }
    
    const contentId = req.params.contentId;
    
    // Get course ID from content
    const contentSql = 'SELECT course_id FROM Content WHERE id = ?';
    connection.query(contentSql, [contentId], function (err, contentResults) {
        if (err || contentResults.length === 0) {
            return res.json({ success: false, error: 'Content not found' });
        }
        
        const courseId = contentResults[0].course_id;
        
        // Check if user is enrolled
        const enrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
        connection.query(enrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
            if (err || enrollmentResults.length === 0) {
                return res.json({ success: false, error: 'Not enrolled in this course' });
            }
            
            // Check if already completed
            const checkSql = 'SELECT * FROM LessonCompletion WHERE student_id = ? AND content_id = ?';
            connection.query(checkSql, [req.session.user.id, contentId], function (err, completionResults) {
                if (completionResults.length === 0) {
                    const insertSql = 'INSERT INTO LessonCompletion (content_id, course_id, student_id) VALUES (?, ?, ?)';
                    connection.query(insertSql, [contentId, courseId, req.session.user.id], function (err) {
                        if (err) {
                            return res.json({ success: false, error: 'Database error' });
                        }
                        
                        // Update completion percentage
                        updateCompletionPercentage(req.session.user.id, courseId);
                        
                        res.json({ success: true, message: 'Content marked as completed!' });
                    });
                } else {
                    res.json({ success: true, message: 'Content already completed' });
                }
            });
        });
    });
});

// Student Learning Routes

// Student's enrolled courses
app.get('/my-learning', function(req, res) {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.redirect('/dashboard');
    }

    const sql = `
        SELECT c.*, t.name as teacher_name,
               e.completion_percentage,
               (SELECT COUNT(*) FROM Content WHERE course_id = c.id) as total_content,
               (SELECT COUNT(*) FROM LessonCompletion WHERE student_id = ? AND course_id = c.id) as completed_content
        FROM Course c 
        JOIN Teacher t ON c.teacher_id = t.id 
        JOIN Enrollment e ON c.id = e.course_id 
        WHERE e.student_id = ?
        ORDER BY e.enrolled_at DESC
    `;

    connection.query(sql, [req.session.user.id, req.session.user.id], function (err, courses) {
        if (err) {
            console.error('My learning error:', err);
            return res.render('my-learning', {
                user: req.session.user,
                courses: [],
                error: 'Failed to load your courses'
            });
        }

        res.render('my-learning', {
            user: req.session.user,
            courses: courses,
            error: null
        });
    });
});

// Course learning interface with content
app.get('/learn/:courseId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const courseId = req.params.courseId;

    // Check if student is enrolled
    const enrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
    connection.query(enrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
        if (err || enrollmentResults.length === 0) {
            return res.redirect('/course/' + courseId);
        }

        // Get course details
        const courseSql = `
            SELECT c.*, t.name as teacher_name
            FROM Course c 
            JOIN Teacher t ON c.teacher_id = t.id 
            WHERE c.id = ?
        `;

        connection.query(courseSql, [courseId], function (err, courseResults) {
            if (err || courseResults.length === 0) {
                return res.redirect('/my-learning');
            }

            const course = courseResults[0];

            // Get all content for this course
            const contentSql = `
                SELECT cont.*, 
                       (SELECT 1 FROM LessonCompletion 
                        WHERE student_id = ? AND content_id = cont.id) as is_completed
                FROM Content cont 
                WHERE cont.course_id = ? 
                ORDER BY cont.created_at ASC
            `;

            connection.query(contentSql, [req.session.user.id, courseId], function (err, content) {
                if (err) {
                    console.error('Content error:', err);
                    content = [];
                }

                // Get current content (first incomplete content or last content)
                let currentContent = null;
                if (content.length > 0) {
                    currentContent = content.find(item => !item.is_completed) || content[content.length - 1];
                }

                res.render('learn-course', {
                    user: req.session.user,
                    course: course,
                    content: content,
                    currentContent: currentContent,
                    error: null
                });
            });
        });
    });
});

// Specific content learning page
app.get('/learn/:courseId/content/:contentId', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { courseId, contentId } = req.params;

    // Check if student is enrolled
    const enrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
    connection.query(enrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
        if (err || enrollmentResults.length === 0) {
            return res.redirect('/course/' + courseId);
        }

        // Get course details
        const courseSql = 'SELECT c.*, t.name as teacher_name FROM Course c JOIN Teacher t ON c.teacher_id = t.id WHERE c.id = ?';
        connection.query(courseSql, [courseId], function (err, courseResults) {
            if (err || courseResults.length === 0) {
                return res.redirect('/my-learning');
            }

            const course = courseResults[0];

            // Get all content for navigation
            const contentSql = `
                SELECT cont.*, 
                       (SELECT 1 FROM LessonCompletion 
                        WHERE student_id = ? AND content_id = cont.id) as is_completed
                FROM Content cont 
                WHERE cont.course_id = ? 
                ORDER BY cont.created_at ASC
            `;

            connection.query(contentSql, [req.session.user.id, courseId], function (err, content) {
                if (err) {
                    console.error('Content error:', err);
                    return res.redirect('/learn/' + courseId);
                }

                // Get current content details
                const currentContentSql = 'SELECT * FROM Content WHERE id = ? AND course_id = ?';
                connection.query(currentContentSql, [contentId, courseId], function (err, contentResults) {
                    if (err || contentResults.length === 0) {
                        return res.redirect('/learn/' + courseId);
                    }

                    const currentContent = contentResults[0];
                    
                    // Check if content is completed
                    const completionSql = 'SELECT * FROM LessonCompletion WHERE student_id = ? AND content_id = ?';
                    connection.query(completionSql, [req.session.user.id, contentId], function (err, completionResults) {
                        currentContent.is_completed = completionResults.length > 0;

                        // Get next and previous content
                        const currentIndex = content.findIndex(item => item.id == contentId);
                        const nextContent = currentIndex < content.length - 1 ? content[currentIndex + 1] : null;
                        const prevContent = currentIndex > 0 ? content[currentIndex - 1] : null;

                        res.render('learn-lesson', {
                            user: req.session.user,
                            course: course,
                            content: content,
                            currentContent: currentContent,
                            nextContent: nextContent,
                            prevContent: prevContent,
                            error: null
                        });
                    });
                });
            });
        });
    });
});

// Add recommendation feedback
app.post('/add-feedback/:courseId', function(req, res) {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.redirect('/login');
    }

    const courseId = req.params.courseId;
    const { feedback } = req.body;

    // Check if user is enrolled
    const enrollmentSql = 'SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?';
    connection.query(enrollmentSql, [req.session.user.id, courseId], function (err, enrollmentResults) {
        if (err || enrollmentResults.length === 0) {
            return res.redirect('/course/' + courseId);
        }

        // Check if already gave feedback
        const checkSql = 'SELECT * FROM RecommendationFeedback WHERE student_id = ? AND course_id = ?';
        connection.query(checkSql, [req.session.user.id, courseId], function (err, feedbackResults) {
            if (feedbackResults.length > 0) {
                // Update existing feedback
                const updateSql = 'UPDATE RecommendationFeedback SET feedback = ? WHERE student_id = ? AND course_id = ?';
                connection.query(updateSql, [feedback, req.session.user.id, courseId], function (err) {
                    res.redirect('/learn/' + courseId);
                });
            } else {
                // Insert new feedback
                const insertSql = 'INSERT INTO RecommendationFeedback (student_id, course_id, feedback) VALUES (?, ?, ?)';
                connection.query(insertSql, [req.session.user.id, courseId, feedback], function (err) {
                    res.redirect('/learn/' + courseId);
                });
            }
        });
    });
});

// Course progress tracking
app.get('/api/progress/:courseId', function(req, res) {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.json({ error: 'Not authorized' });
    }

    const courseId = req.params.courseId;

    const sql = `
        SELECT 
            e.completion_percentage,
            (SELECT COUNT(*) FROM Content WHERE course_id = ?) as total_content,
            (SELECT COUNT(*) FROM LessonCompletion WHERE student_id = ? AND course_id = ?) as completed_content
    `;

    connection.query(sql, [courseId, req.session.user.id, courseId], function (err, results) {
        if (err) {
            return res.json({ error: 'Database error' });
        }

        const progress = results[0];
        res.json({
            total_content: progress.total_content,
            completed_content: progress.completed_content,
            percentage: progress.completion_percentage
        });
    });
});

// Achievement Routes - Updated for your schema

// Achievements page
app.get('/achievements', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.type !== 'student') {
        return res.redirect('/dashboard');
    }

    const studentId = req.session.user.id;

    // Get student's achievements and progress using your schema structure
    const achievementsSql = `
        SELECT 
            -- Course completion achievements
            (SELECT COUNT(*) FROM Enrollment WHERE student_id = ? AND completion_percentage = 100) as completed_courses,
            (SELECT COUNT(*) FROM Enrollment WHERE student_id = ?) as total_enrolled_courses,
            
            -- Lesson completion stats
            (SELECT COUNT(*) FROM LessonCompletion WHERE student_id = ?) as completed_lessons,
            (SELECT COUNT(*) FROM Content c JOIN Enrollment e ON c.course_id = e.course_id WHERE e.student_id = ?) as total_lessons,
            
            -- Learning streak (simplified)
            (SELECT COUNT(DISTINCT DATE(completed_at)) FROM LessonCompletion 
             WHERE student_id = ? AND completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_activity,
            
            -- Forum participation
            (SELECT COUNT(*) FROM ForumPost WHERE author_id = ? AND author_type = 'student') as forum_posts,
            (SELECT COUNT(*) FROM ForumReply WHERE author_id = ? AND author_type = 'student') as forum_replies,
            
            -- Reviews given
            (SELECT COUNT(*) FROM CourseReview WHERE student_id = ?) as reviews_given,
            
            -- Get earned achievements from Achievement table
            (SELECT COUNT(*) FROM Achievement WHERE student_id = ?) as earned_achievements
    `;

    connection.query(achievementsSql, [
        studentId, studentId, studentId, studentId, 
        studentId, studentId, studentId, studentId, studentId
    ], function (err, results) {
        if (err) {
            console.error('Achievements error:', err);
            return res.render('achievements', {
                user: req.session.user,
                stats: {},
                achievements: [],
                error: 'Failed to load achievements'
            });
        }

        const stats = results[0];
        
        // Calculate achievements based on stats (this creates virtual achievements)
        const achievements = calculateAchievements(stats);
        
        // Get actually earned achievements from database
        const earnedAchievementsSql = 'SELECT * FROM Achievement WHERE student_id = ? ORDER BY earned_at DESC';
        connection.query(earnedAchievementsSql, [studentId], function(err, earnedResults) {
            if (err) {
                console.error('Error fetching earned achievements:', err);
            }

            // Calculate overall progress
            const totalAchievements = achievements.length;
            const unlockedAchievements = achievements.filter(a => a.unlocked).length;
            const progressPercentage = totalAchievements > 0 ? Math.round((unlockedAchievements / totalAchievements) * 100) : 0;

            res.render('achievements', {
                user: req.session.user,
                stats: stats,
                achievements: achievements,
                earnedAchievements: earnedResults || [],
                progressPercentage: progressPercentage,
                unlockedCount: unlockedAchievements,
                totalCount: totalAchievements,
                error: null
            });
        });
    });
});

// Helper function to calculate virtual achievements (compatible with your schema)
function calculateAchievements(stats) {
    const achievements = [
        {
            id: 1,
            name: "First Steps",
            description: "Complete your first lesson",
            icon: "🎯",
            requirement: "Complete 1 lesson",
            unlocked: stats.completed_lessons >= 1,
            progress: Math.min(stats.completed_lessons, 1),
            target: 1,
            type: "lesson",
            points: 10
        },
        {
            id: 2,
            name: "Dedicated Learner",
            description: "Complete 10 lessons",
            icon: "📚",
            requirement: "Complete 10 lessons",
            unlocked: stats.completed_lessons >= 10,
            progress: Math.min(stats.completed_lessons, 10),
            target: 10,
            type: "lesson",
            points: 25
        },
        {
            id: 3,
            name: "Course Conqueror",
            description: "Complete 25 lessons",
            icon: "🏆",
            requirement: "Complete 25 lessons",
            unlocked: stats.completed_lessons >= 25,
            progress: Math.min(stats.completed_lessons, 25),
            target: 25,
            type: "lesson",
            points: 50
        },
        {
            id: 4,
            name: "First Course",
            description: "Complete your first course",
            icon: "🎓",
            requirement: "Complete 1 course",
            unlocked: stats.completed_courses >= 1,
            progress: Math.min(stats.completed_courses, 1),
            target: 1,
            type: "course",
            points: 30
        },
        {
            id: 5,
            name: "Course Collector",
            description: "Complete 3 courses",
            icon: "⭐",
            requirement: "Complete 3 courses",
            unlocked: stats.completed_courses >= 3,
            progress: Math.min(stats.completed_courses, 3),
            target: 3,
            type: "course",
            points: 75
        },
        {
            id: 6,
            name: "Active Participant",
            description: "Post 5 forum messages",
            icon: "💬",
            requirement: "5 forum posts/replies",
            unlocked: (stats.forum_posts + stats.forum_replies) >= 5,
            progress: Math.min((stats.forum_posts + stats.forum_replies), 5),
            target: 5,
            type: "community",
            points: 20
        },
        {
            id: 7,
            name: "Helpful Reviewer",
            description: "Write 3 course reviews",
            icon: "📝",
            requirement: "Write 3 reviews",
            unlocked: stats.reviews_given >= 3,
            progress: Math.min(stats.reviews_given, 3),
            target: 3,
            type: "community",
            points: 25
        }
    ];

    return achievements;
}

// API to get achievement progress
app.get('/api/achievements/progress', function(req, res) {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.json({ error: 'Not authorized' });
    }

    const studentId = req.session.user.id;

    const statsSql = `
        SELECT 
            (SELECT COUNT(*) FROM Enrollment WHERE student_id = ? AND completion_percentage = 100) as completed_courses,
            (SELECT COUNT(*) FROM LessonCompletion WHERE student_id = ?) as completed_lessons,
            (SELECT COUNT(*) FROM ForumPost WHERE author_id = ? AND author_type = 'student') + 
            (SELECT COUNT(*) FROM ForumReply WHERE author_id = ? AND author_type = 'student') as forum_activity,
            (SELECT COUNT(*) FROM CourseReview WHERE student_id = ?) as reviews_given
    `;

    connection.query(statsSql, [studentId, studentId, studentId, studentId, studentId], function (err, results) {
        if (err) {
            return res.json({ error: 'Database error' });
        }

        const stats = results[0];
        const achievements = calculateAchievements(stats);
        const unlockedCount = achievements.filter(a => a.unlocked).length;
        
        res.json({
            unlocked: unlockedCount,
            total: achievements.length,
            progress: Math.round((unlockedCount / achievements.length) * 100)
        });
    });
});

// Function to check and award achievements (call this when user completes actions)
function checkAndAwardAchievements(studentId, actionType, progressAmount) {
    const statsSql = `
        SELECT 
            (SELECT COUNT(*) FROM Enrollment WHERE student_id = ? AND completion_percentage = 100) as completed_courses,
            (SELECT COUNT(*) FROM LessonCompletion WHERE student_id = ?) as completed_lessons,
            (SELECT COUNT(*) FROM ForumPost WHERE author_id = ? AND author_type = 'student') + 
            (SELECT COUNT(*) FROM ForumReply WHERE author_id = ? AND author_type = 'student') as forum_activity,
            (SELECT COUNT(*) FROM CourseReview WHERE student_id = ?) as reviews_given
    `;

    connection.query(statsSql, [studentId, studentId, studentId, studentId, studentId], function (err, results) {
        if (err) return;

        const stats = results[0];
        const achievements = calculateAchievements(stats);
        
        achievements.forEach(achievement => {
            if (achievement.unlocked) {
                // Check if achievement already exists in database
                const checkSql = 'SELECT id FROM Achievement WHERE student_id = ? AND name = ?';
                connection.query(checkSql, [studentId, achievement.name], function(err, existing) {
                    if (err) return;
                    
                    if (existing.length === 0) {
                        // Award the achievement
                        const awardSql = 'INSERT INTO Achievement (name, description, points, student_id) VALUES (?, ?, ?, ?)';
                        connection.query(awardSql, [
                            achievement.name,
                            achievement.description,
                            achievement.points,
                            studentId
                        ], function(err, result) {
                            if (!err) {
                                console.log(`Achievement awarded: ${achievement.name} to student ${studentId}`);
                                
                                // Update student points
                                const updatePointsSql = 'UPDATE Student SET total_points = total_points + ? WHERE id = ?';
                                connection.query(updatePointsSql, [achievement.points, studentId]);
                            }
                        });
                    }
                });
            }
        });
    });
}




// Logout
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, function() {
    console.log('UpSkillo App listening on port 3000');
});