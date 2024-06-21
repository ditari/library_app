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

//post addbook
app.post('/book/addbook', async (req, res) => {
    if (req.session.authenticated){
        const bookname = req.body.bookname;
        const author = req.body.author;
        const category = req.body.category;
        let  message = `The book cannot be added to library database`;
        let details ={};
        
        const result = await db.query(
            `INSERT INTO Books (b_name, b_author, b_category, is_borrowed_status)
            VALUES ('${bookname}', '${author}', '${category}', false)
            RETURNING b_id;`
          );
    
        let b_id = result.rows[0].b_id;
        if (b_id!==null)
        {
            message = `The book is successfully added to library database`;
            details.id = b_id;
            details.bookname = bookname;
            details.author = author;
            details.category=category; 
        
        }    
            
        res.render("book/addbook.ejs",{message: message, details:details});    
    }
    else
    res.render ("login.ejs");

});

//get deletebook
app.get('/book/deletebook', (req, res) => {
    if (req.session.authenticated) {
        res.render("book/deletebook.ejs");
    }
    else
    res.render ("login.ejs");
});

//post deletebook
app.post('/book/deletebook', async (req, res) => {
    if (req.session.authenticated){
        const bookid = req.body.bookid;
        let  message = `The book cannot be deleted from library database`;
        let details ={};
        
        const result = await db.query(
            `DELETE FROM Books WHERE b_id = ${bookid} RETURNING *;`
          );
    
        let b_id = result.rows[0].b_id;
        if (b_id!==null)
        {
            message = `The book is successfully deleted from library database`;
            details.id = b_id;
            details.bookname = result.rows[0].b_bookname;
            details.author = result.rows[0].b_author;
            details.category = result.rows[0].b_category;
        
        }    
            
        res.render("book/deletebook.ejs",{message: message, details:details});    
    }
    else
    res.render ("login.ejs");

});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
