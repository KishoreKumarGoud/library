const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// In-memory storage for registered users (replace with database in production)
const users = [];

// Dummy data for books (replace with database in production)
const books = [
    { title: 'Book 1', year: 1, department: 'CSE', subjects: ['Subject A', 'Subject B'] },
    { title: 'Book 2', year: 2, department: 'ECE', subjects: ['Subject C', 'Subject D'] },
    { title: 'Book 3', year: 3, department: 'EEE', subjects: ['Subject E', 'Subject F'] },
    { title: 'Book 4', year: 4, department: 'IT', subjects: ['Subject G', 'Subject H'] }
];

// Routes
app.get('/', (req, res) => {
    res.redirect('/register');
});

// Register route
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).send('User already exists');
    }

    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            // Store user in memory (replace with database storage)
            users.push({ username, password: hash });
            res.redirect('/login'); // Redirect to login page after registration
        });
    });
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).send('User not found');
    }

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            // Redirect to main library homepage upon successful login
            res.redirect('/homepage');
        } else {
            res.status(400).send('Incorrect password');
        }
    });
});

// Homepage route
app.get('/homepage', (req, res) => {
    // Serve homepage HTML file
    res.sendFile(__dirname + '/public/homepage.html');
});


// Route to handle filtered content
app.post('/filtered-content', (req, res) => {
    const { year, department } = req.body;

    // Redirect to a page with filtered content based on selected filters
    switch (department) {
        case 'CSE':
            if (year === '1') {
                res.redirect('/cse-first-year');
            } else if (year === '2') {
                res.redirect('/cse-second-year');
            } else if (year === '3') {
                res.redirect('/cse-third-year');
            } else if (year === '4') {
                res.redirect('/cse-fourth-year');
            }
            break;
        // Add cases for other departments if needed
        default:
            res.redirect('/homepage');
            break;
    }
});



// Route for displaying filtered books
app.get('/filtered-books', (req, res) => {
    res.sendFile(__dirname + '/public/filtered-books.html');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

