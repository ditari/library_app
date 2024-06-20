import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

const app = express();
const PORT = 3000;

//db
const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "LibraryDatabase",
  });


// Middleware setup
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Hash a password with bcrypt
/*async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}*/

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}


// Routes
app.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.render("borrow.ejs");
    }
    else
    res.render ("login.ejs");
});

app.post('/login', async (req, res) => {
    const password = req.body.password;
    const user = req.body.username;

    let query1 = `SELECT a_password FROM Admin where a_username = "${user}" ;`
    const [results, fields] = await connection.query(query1);
    const db_pass= results[0].a_password;
    
    const match = await comparePassword(password,db_pass);
    if (match) 
        req.session.authenticated = true;
    
    return res.redirect('/');

});

/*
app.get('/protected', (req, res) => {
    if (req.session.authenticated) {
        return res.send('This is a protected page!');
    }
    res.redirect('/');
});

app.get('/protected2', (req, res) => {
    if (req.session.authenticated) {
        return res.send('This is a protected page! 2');
    }
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
}); */

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
