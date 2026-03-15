# UpSkillo - Online Learning Platform

A comprehensive online learning platform built with Node.js, Express, MySQL, and EJS templates.

## 🚀 Features

- **User Authentication** (Student/Teacher roles)
- **Course Management** (Create, enroll, manage courses)
- **Learning System** (Lessons, progress tracking)
- **Payment Integration** (Course enrollment with payment)
- **Reviews & Ratings** (Course feedback system)
- **Forum System** (Course discussions and Q&A)
- **Progress Tracking** (Lesson completion tracking)

## 📋 Prerequisites

Before running the application, make sure you have:

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## 🛠️ Installation

1. **Clone or download the project files**

2. **Install dependencies:**
```bash
npm install express mysql2 express-session bcryptjs body-parser ejs
```

3. **Set up the database:**
   - Create a MySQL database named `up_skillo_db`
   - Run the `schema.sql` file to create all necessary tables

4. **Configure the database connection:**
   Edit `database.js` with your MySQL credentials:

```javascript
// database.js
var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: "localhost",          // Your MySQL host
  user: "root",               // Your MySQL username
  password: "your_password",  // Your MySQL password
  database: "up_skillo_db"    // Database name
});

module.exports = connection;
```

## ⚙️ Configuration

### Database Configuration (database.js)
Update the following fields in `database.js`:

- `host`: Your MySQL server host (usually "localhost")
- `user`: Your MySQL username (usually "root")
- `password`: Your MySQL password
- `database`: Database name ("up_skillo_db")

### Session Secret
The application uses express-session. For production, change the session secret in `index.js`:

```javascript
app.use(session({
    secret: 'your_secret_key_here', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
```

## 🎯 How to Run

1. **Start the application:**
```bash
node index.js
```

2. **Or use nodemon for development (auto-restart):**
```bash
npm install -g nodemon
nodemon index.js
```

3. **Access the application:**
   Open your browser and go to: `http://localhost:3000`

## 📁 Project Structure

```
D2/
├── index.js              # Main application file
├── database.js           # Database configuration
├── disconnect_port.js    # Utility to kill port 3000
├── schema.sql            # Database schema
├── templates/            # EJS template files
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── dashboard.ejs
│   ├── courses.ejs
│   ├── my-learning.ejs
│   ├── course-details.ejs
│   ├── enroll.ejs
│   ├── create-course.ejs
│   ├── add-lesson.ejs
│   └── my-courses.ejs
└── package.json          # Project dependencies
```

## 👥 Default User Roles

- **Students**: Can browse courses, enroll, learn, and participate in forums
- **Teachers**: Can create courses, add lessons, and manage their courses

## 💰 Payment System

- Course prices range from $100 to $200
- Prices must be divisible by 10
- Demo payment processing included (for educational purposes)

## 🗄️ Database Schema

The system includes tables for:
- Users (students/teachers)
- Courses and Lessons
- Enrollments and Payments
- Reviews and Ratings
- Forum posts and replies
- Lesson completion tracking
- Achievements system

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Check MySQL service is running
   - Verify credentials in `database.js`
   - Ensure database `up_skillo_db` exists

2. **Port 3000 Already in Use:**
   - Run `node disconnect_port.js` to kill the port
   - Or change the port in `index.js`

3. **Template Errors:**
   - Ensure all EJS files are in the `templates` folder
   - Check for syntax errors in EJS templates

## 📝 Usage Guide

1. **First Time Setup:**
   - Start the application
   - Register as a teacher to create courses
   - Register as a student to enroll in courses

2. **For Teachers:**
   - Create courses with prices between $100-$200
   - Add lessons to your courses
   - Manage student enrollments

3. **For Students:**
   - Browse available courses
   - Enroll in courses (payment required)
   - Track learning progress
   - Participate in course discussions

## 🔒 Security Notes

- This is a demo application for educational purposes
- Implement proper security measures for production use
- Use environment variables for sensitive data
- Implement proper input validation and sanitization
- Use HTTPS in production

## 📞 Support

For issues or questions, check the error logs in the console and ensure all dependencies are properly installed.

---

**Happy Learning! 🎓**
