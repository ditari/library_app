import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import pg from "pg";

const app = express();
const PORT = 3000;
let admin_id="";

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
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
//get login sama dengan /
app.get("/login", (req, res) => {
  if (req.session.authenticated) {
    res.render("index.ejs");
  } else res.render("login.ejs");
});

// post login
app.post("/login", async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  let message = "Incorrect username/password";
  try{

    const result = await db.query(
      `SELECT a_password FROM Admin where a_username = '${username}'`
    );
    const db_pass = result.rows[0].a_password;
  
    const match = await bcrypt.compare(password, db_pass);
    if (match) 
    {
      req.session.authenticated = true;
      const result = await db.query(
        `SELECT a_id FROM Admin where a_username = '${username}'`
      );
      admin_id=result.rows[0].a_id;
      res.render("index.ejs");
    }
    else 
    {
      //message = "Incorrect password";
      res.render("login.ejs", { message: message});
    }
  }
  catch(err){
    res.render("login.ejs", { message: message});
  }

});

//index
app.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.render("index.ejs");
  } else res.render("login.ejs");
});

//get addbook
app.get("/book/addbook", (req, res) => {
  if (req.session.authenticated) {
    res.render("book/addbook.ejs");
  } else res.render("login.ejs");
});

//post addbook
app.post("/book/addbook", async (req, res) => {
  if (req.session.authenticated) {
    const bookname = req.body.bookname;
    const author = req.body.author;
    const category = req.body.category;
    const isbn = req.body.isbn;
    let message = `The book cannot be added to library database`;
    let details = {};

    const result = await db.query(
      `INSERT INTO Books (b_name, b_author, b_category, ISBN, is_borrowed_status)
            VALUES ('${bookname}', '${author}', '${category}','${isbn}', false)
            RETURNING *;`
    );

    if (result.rows.length > 0) {
      message = `The book is successfully added to library database`;
      details.id = result.rows[0].b_id;
      details.name = result.rows[0].b_name;
      details.author = result.rows[0].b_author;
      details.category = result.rows[0].b_category;
      details.isbn = result.rows[0].isbn;
    }

    res.render("book/addbook.ejs", { message: message, details: details });
  } else res.render("login.ejs");
});

//get deletebook
app.get("/book/deletebook", (req, res) => {
  if (req.session.authenticated) {
    res.render("book/deletebook.ejs");
  } else res.render("login.ejs");
});

//post deletebook
app.post("/book/deletebook", async (req, res) => {
  if (req.session.authenticated) {
    const bookid = req.body.bookid;
    let message = `Cannot delete book from library database`;
    let details = {};
      //check if book exist
      let result = await db.query(
        `SELECT * FROM Books WHERE b_id = ${bookid} ;`
      );
      if (result.rows.length > 0) {
        //delete
        result = await db.query(
          `DELETE FROM Books WHERE b_id = ${bookid} RETURNING *;`
        );
        if (result.rows.length>0) {
          message = `The book is successfully deleted from library database`;
          details.id = result.rows[0].b_id;
          details.bookname = result.rows[0].b_bookname;
          details.author = result.rows[0].b_author;
          details.author = result.rows[0].b_author;
          details.category = result.rows[0].b_category;
          details.isbn = result.rows[0].isbn;
        }
      } else {
        message = `The book does not exist in the library database`;
      }
    res.render("book/deletebook.ejs", { message: message, details: details });
  } else res.render("login.ejs");
});

//get adduser
app.get("/user/adduser", (req, res) => {
  if (req.session.authenticated) {
    res.render("user/adduser.ejs");
  } else res.render("login.ejs");
});

//post adduser
app.post("/user/adduser", async (req, res) => {
  if (req.session.authenticated) {
    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;
    let message = `The user cannot be registered`;
    let details = {};

    const result = await db.query(
      `INSERT INTO Users (u_name, u_address, u_email, u_phone, is_borrowed_status)
            VALUES ('${name}', '${address}', '${email}','${phone}', false)
            RETURNING *;`
    );

    if (result.rows.length > 0) {
      message = `The user is successfully registered`;
      details.id = result.rows[0].u_id;
      details.name = result.rows[0].u_name;
      details.address = result.rows[0].u_address;
      details.phone = result.rows[0].u_phone;
      details.email = result.rows[0].u_email;
    }

    res.render("user/adduser.ejs", { message: message, details: details });
  } else res.render("login.ejs");
});

//get deleteuser
app.get("/user/deleteuser", (req, res) => {
    if (req.session.authenticated) {
      res.render("user/deleteuser.ejs");
    } else res.render("login.ejs");
  });
  

//post deleteuser
app.post("/user/deleteuser", async (req, res) => {
    if (req.session.authenticated) {
      const userid = req.body.userid;
      let message = `Cannot delete user from library database`;
      let details = {};
        //check if book exist
        let result = await db.query(
          `SELECT * FROM Users WHERE u_id = ${userid} ;`
        );
        if (result.rows.length > 0) {
          //delete
          result = await db.query(
            `DELETE FROM Users WHERE u_id = ${userid} RETURNING *;`
          );
          if (result.rows.length > 0) {
            details.id = result.rows[0].u_id;
            details.name = result.rows[0].u_name;
            details.address = result.rows[0].u_address;
            details.email = result.rows[0].u_email;
            details.phone = result.rows[0].u_phone;
          }
        } else {
          message = `The user does not exist in the library database`;
        }
      res.render("user/deleteuser.ejs", { message: message, details: details });
    } else res.render("login.ejs");
  });

 //logout admin
 app.get("/logout", (req, res) => {
  req.session.authenticated = false;
  admin_id = "";
  res.redirect("/");
}); 

//check if username available
app.post('/check-username', async (req, res) => {
  const username = req.body.username;
  const result = await db.query(
    `Select * FROM Admin WHERE a_username = '${username}';`
  );
  if (result.rows.length>0) {
      res.json({ available: false });
  } else {
      res.json({ available: true });
  }
});

//get change admin username
app.get("/admin/username", (req, res) => {
  if (req.session.authenticated) {
    res.render("admin/username.ejs");
  } else res.render("login.ejs");
 
}); 

//post change admin username
app.post("/admin/username", async (req, res) => {
  if (req.session.authenticated) {
  {
    let message = "Cannot change the admin username";
    const username = req.body.username;
    const result = await db.query(
      `UPDATE Admin SET a_username = '${username}' where a_id = ${admin_id} returning *;`
    );
    if (result.rows.length>0)
    {
      message = "Admin username succesfully changed"; 
      res.render("admin/username.ejs", {message:message, newusername:username});
  
    }     
    else
     res.render("admin/username.ejs", {message:message});
  }  

  } else res.render("login.ejs");
 
}); 

//get change admin password
app.get("/admin/password", (req, res) => {
  if (req.session.authenticated) {
    res.render("admin/password.ejs");
  } else res.render("login.ejs");
}); 

//post change admin password
app.post("/admin/password", async (req, res) => {
  if (req.session.authenticated) 
  {
    let message = "The old password is incorrect";
    try{    
      const oldpassword = req.body.oldpassword;
      const newpassword = req.body.newpassword;
      let result = await db.query(
        `SELECT a_password FROM Admin where a_id = ${admin_id}`
      );
      const db_pass = result.rows[0].a_password;
    
      const match = await bcrypt.compare(oldpassword, db_pass);
      if (match) 
      {
        message = "The password cannot be changed";
        const hashedPassword = await bcrypt.hash(newpassword, 10);
  
        result = await db.query(
          `UPDATE Admin SET a_password = '${hashedPassword}' where a_id = ${admin_id} returning *;`
        );
        if (result.rows.length>0){
          message = "The password successfully changed";
        }
      }
    }
    catch (err){console.log(err);}

    res.render("admin/password.ejs",{message:message});
  }   
  else res.render("login.ejs");

}); 






app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
