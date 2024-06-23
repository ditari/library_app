import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import pg from "pg";
import env from "dotenv";

const app = express();
const PORT = 3000;
env.config();
const fine_amount = 100;

let admin_id="";

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});
db.connect();

// Middleware setup
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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

//check if admin username available
app.post('/check-admin-username', async (req, res) => {
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

//get editbook 
app.get("/book/editbook", (req, res) => {
  if (req.session.authenticated) {
    res.render("book/editbook.ejs");
  } else res.render("login.ejs");
}); 

//check book availability
app.post('/book/check-bookid', async (req, res) => {
  if (req.session.authenticated) {
    const bookid = req.body.bookid;
    let message = "This book is not available";
  
      let result = await db.query(
        `SELECT * FROM Books where b_id = ${bookid};`
      );
      if (result.rows.length > 0) {
        message ="This book is available";
        let name = result.rows[0].b_name;
        let author = result.rows[0].b_author;
        let category = result.rows[0].b_category;
        let isbn = result.rows[0].isbn;
        res.render("book/editbook.ejs",{message:message,name:name,author:author,
          category:category,isbn:isbn,bookid:bookid});
          
      }  
      else{
        res.render("book/editbook.ejs",{message:message, bookid:bookid});
      }
  } 
  else res.render("login.ejs");
});

app.post('/book/editbook', async (req, res) => {
  if (req.session.authenticated) {
    const newbookid = req.body.newbookid;

    if (newbookid.length > 0){
      const newname = req.body.newname;
      const newauthor = req.body.newauthor;
      const newcategory = req.body.newcategory;
      const newisbn = req.body.newisbn;
  
      let message2 = "Cannot update book";
      let details = {};
  
        let result = await db.query(
          `   UPDATE Books 
              SET b_name = '${newname}', b_author = '${newauthor}', b_category = '${newcategory}' , isbn = '${newisbn}' 
              WHERE b_id = ${newbookid} returning * ;`
        );
        if (result.rows.length > 0) {
          message2 = "The book successfully updated";
          details.id = result.rows[0].b_id;
          details.bookname = result.rows[0].b_bookname;
          details.author = result.rows[0].b_author;
          details.category = result.rows[0].b_category;
          details.isbn = result.rows[0].isbn;
          res.render("book/editbook.ejs",{message2:message2, details:details});
        }
        else
        res.render("book/editbook.ejs",{message2:message2});
  
    }
    else{
      let message = "Check book availibility first";
      res.render("book/editbook.ejs",{message:message})
    }  
  } 
  else res.render("login.ejs");
});

//get user edit
app.get("/user/edituser", (req, res) => {
  if (req.session.authenticated) {
    res.render("user/edituser.ejs");
  } else res.render("login.ejs");
}); 

//check user availability
app.post('/user/check-userid', async (req, res) => {
  if (req.session.authenticated) {
    const userid = req.body.userid;
    let message = "No user data is found";
  
      let result = await db.query(
        `SELECT * FROM Users where u_id = ${userid};`
      );
      if (result.rows.length > 0) {
        message ="User data is found";
        
        let name = result.rows[0].u_name;
        let address = result.rows[0].u_address;
        let email = result.rows[0].u_email;
        let phone = result.rows[0].u_phone;

        res.render("user/edituser.ejs",{message:message, userid:userid, 
          name:name, address:address, email:email,phone:phone});
          
      }  
      else{
        res.render("user/edituser.ejs",{message:message, userid:userid});
      }
  } 
  else res.render("login.ejs");
});

app.post('/user/edituser', async (req, res) => {
  if (req.session.authenticated) {
    const newuserid = req.body.newuserid;

    if (newuserid.length > 0){
      const newname = req.body.newname;
      const newaddress = req.body.newaddress;
      const newphone = req.body.newphone;
      const newemail = req.body.newemail;
  
      let message2 = "Cannot update user data";
      let details = {};
  
        let result = await db.query(
          `   UPDATE Users 
              SET u_name = '${newname}', u_address = '${newaddress}', u_email = '${newemail}' , u_phone = '${newphone}' 
              WHERE u_id = ${newuserid} returning * ;`
        );
        if (result.rows.length > 0) {
          message2 = "User data is successfully updated";
          details.id = result.rows[0].u_id;
          details.name = result.rows[0].u_name;
          details.address = result.rows[0].u_address;
          details.email = result.rows[0].u_email;
          details.phone = result.rows[0].u_phone;

          res.render("user/edituser.ejs",{message2:message2, details:details});
        }
        else
        res.render("user/edituser.ejs",{message2:message2});
  
    }
    else{
      let message = "Check if the user data is available first";
      res.render("user/edituser.ejs",{message:message})
    }  
  } 
  else res.render("login.ejs");
});

//get borrow
app.get("/borrowing/borrow", (req, res) => {
  if (req.session.authenticated) {
    res.render("borrowing/borrow.ejs");
  } else res.render("login.ejs");
}); 

//post borrow
app.post("/borrowing/borrow", async (req, res) => {
  if (req.session.authenticated) {
    const bookid = req.body.bookid;    
    const userid = req.body.userid;
    let message="Unable to borrow the book";
    let issuccess = false;
    let details = {};

    //check if book available
    let result = await db.query(
      ` select is_borrowed_status from Books WHERE b_id = ${bookid} ;`
    );
    if ((result.rows.length > 0) && (result.rows[0].is_borrowed_status == false))
     {
      //check if user exist
        result = await db.query(`select * from Users WHERE u_id = ${userid};`);
        if (result.rows.length > 0)
        {
          result = await db.query(
          `insert into Borrowing (b_id,a_id,u_id,borrow_date,due_date,is_borrowed_status)
          values (${bookid},${admin_id},${userid},(NOW())::DATE, (NOW() + INTERVAL '2 weeks')::DATE, true) returning *`
        );
          if (result.rows.length > 0)
          {
            //get duedate
            details.duedate = result.rows[0].due_date.toLocaleDateString();
            //console.log(result.rows[0].due_date.toLocaleDateString());

            let result2 = await db.query(
                `UPDATE Users SET is_borrowed_status = TRUE where u_id = ${userid} returning *;`);
            let result3 = await db.query(
                  `UPDATE Books SET is_borrowed_status = TRUE where b_id = ${bookid} returning * ;`);

            if ((result2.rows.length > 0) && (result3.rows.length > 0))
            {
              issuccess = true;
              //get book name and author
              result = await db.query(
                `select * from Books where b_id = ${bookid};`);
              
              details.bookname = result.rows[0].b_name;
              details.author = result.rows[0].b_author;

              //get username  
              result = await db.query(
                `select * from Users where u_id = ${userid};`);
              
              details.username = result.rows[0].u_name;
              
              //get message
              message = "The book "+bookid+ " is successfully borrowed by user "+userid;

            }   
            
          }  

        }  
     } 
if (issuccess)
  res.render("borrowing/borrow.ejs",{message:message, details:details})
else
  res.render("borrowing/borrow.ejs",{message:message})


  } else res.render("login.ejs");
}); 

//get return book
app.get("/borrowing/return", (req, res) => {
  if (req.session.authenticated) {
    res.render("borrowing/return.ejs");
  } else res.render("login.ejs");
}); 

//post return book
app.post("/borrowing/return", async (req, res) => {
  if (req.session.authenticated) {
    const bookid = req.body.bookid;  
    let message = "";
    let details = {};
    let is_late= false;
    let finemessage = "";
    let fineid="";

    //check if book is borrowed
    let result = await db.query(
      `Select * from Borrowing where b_id = ${bookid} and is_borrowed_status = true ;`);
    if (result.rows.length > 0)
    {
      //update table borrowing
      let borrow_id = result.rows[0].borrow_id;
      let user_id = result.rows[0].u_id;
      result = await db.query(`UPDATE Borrowing SET is_borrowed_status = false, return_date = (NOW())::DATE
         where borrow_id = ${borrow_id} returning *;`);

      details.returndate = result.rows[0].return_date.toLocaleDateString();
      
      //check fine
      let due_date = new Date(result.rows[0].due_date);
      let return_date = new Date(result.rows[0].return_date);
      if (return_date > due_date)
      {
        is_late=true;
        let diff = daysBetween(due_date,return_date);
        let fine = fine_amount*diff;
        finemessage = "The book is "+diff+ " day(s) late. The fine amount is "+ fine;
        
        //insert into fine 
        result = await db.query(`insert into Fine (b_id, u_id, a_id, fine_amount, paid_status)
        values (${bookid}, ${user_id}, ${admin_id}, ${fine}, false)
        returning f_id;`);
        fineid = result.rows[0].f_id;
      }          

      //update table book
      result = await db.query(`UPDATE Books SET is_borrowed_status = false
        where b_id = ${bookid} returning *;`);

      details.bookname = result.rows[0].b_name;
      details.author = result.rows[0].b_author;
         
      //check if user still borrows  
      result = await db.query(`select * from Borrowing where u_id = ${user_id} and is_borrowed_status=true;`);
      if (result.rows.length == 0)
      {
        result = await db.query(`UPDATE Users SET is_borrowed_status = false
          where u_id = ${user_id} returning *;`);
          
      }  

      //select user
      result = await db.query(`select * from Users where u_id = ${user_id};`);  
      details.username = result.rows[0].u_name;


      //message
      message = "The book is successfully returned";

      if (is_late)
        res.render("borrowing/return.ejs",{message:message, finemessage:finemessage, fineid:fineid, details:details})
      else
        res.render("borrowing/return.ejs",{message:message,details:details})
    }  
    else
    {
      message = "Unable to return the book"
      res.render("borrowing/return.ejs",{message:message});

    }

  } else res.render("login.ejs");
}); 

function daysBetween(date1, date2) {
  // Convert to Date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(d2 - d1);

  // Convert the time difference from milliseconds to days
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
  const dayDifference = Math.ceil(timeDifference / millisecondsPerDay);

  return dayDifference;
}

app.post("/borrowing/payfine", async (req, res) => {
  const fineid = req.body.fineid;  
  let result = await db.query(`UPDATE Fine SET paid_status = true where f_id = ${fineid} returning *;`);  
  const fine =  result.rows[0].fine_amount;
  res.render("borrowing/payfine.ejs",{fine:fine});
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
