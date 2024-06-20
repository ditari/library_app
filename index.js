import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import pg from "pg";


const app = express();
const PORT = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "LibraryDatabase",
    password: "root",
    port: 5432,
  });
db.connect();


// Middleware setup
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


// Routes
//login
app.post('/login', async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;


    const result = await db.query(
        `SELECT a_password FROM Admin where a_username = '${username}'`
      );
     // const pass = result.rows[0];
      const db_pass = result.rows[0].a_password;

    const match = await bcrypt.compare(password,db_pass);
    if (match) 
        req.session.authenticated = true;
    
    return res.redirect('/');

});

//index
app.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.render("index.ejs");
    }
    else
    res.render ("login.ejs");
});

//get addbook
app.get('/book/addbook', (req, res) => {
    if (req.session.authenticated) {
        res.render("book/addbook.ejs");
    }
    else
    res.render ("login.ejs");
});


//ini belum pake postgres
app.post('/book/addbook', async (req, res) => {
    const bookname = req.body.bookname;
    const author = req.body.author;
    const category = req.body.category;
    let message = `${bookname} cannot be added to library database`;

    const result = await db.query(
        `INSERT INTO Books (b_name, b_author, b_category, is_borrowed_status)
        VALUES ('${bookname}', '${author}', '${category}', false)
        RETURNING b_id;`
      );

    console.log(result.rows[0].b_id);
    
    message = `${bookname} is successfully added to library database`;    
    
    res.render("book/addbook.ejs",{message: message});
});


//post addbook




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
