
const express = require('express'); 
const app = express();
const { faker } = require('@faker-js/faker');
const mysql2 = require('mysql2');
const path = require('path');
const methodOverride=require("method-override")

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');  
app.set("views", path.join(__dirname , "/views"));

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'Sigma_app',
});

let getRandomUser = () => {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };
};

//  Insert query to insert 100 random users into the database
// let q = "INSERT INTO users (id, username, email, password) VALUES ?";

// let data = [];



// for (let i = 0; i < 100; i++) {
//     let user = getRandomUser();

//     data.push([
//         user.userId,
//         user.username,
//         user.email,
//         user.password
//     ]);
// }

// connection.query(q, [data], (err, result) => {
//     if (err) {
//         console.log('Insert error:', err.message);
//     } else {
//         console.log('Users inserted:', result.affectedRows);
//     }
// });
// home route
app.get('/', (req, res) => {
    let q = `SELECT COUNT(*) FROM users`;
     try{
    connection.query(q, (err, results) => {
        if (err) throw err;
           console.log( results);
           let count = results[0]['COUNT(*)'];
           res.render("home.ejs", { count });
        });
      }catch (error) {
        console.error( error); 

        res.send(`some error in the query `);
    }
});

// Show Route
app.get('/user', (req, res) => {
  let q = `SELECT * FROM users`;
   try{
    connection.query(q, (err, users) => {
        if (err) throw err;
           res.render("show.ejs", { users });
        });
      }catch (error) {
        console.error( error); 

        res.send(`some error in the query `);
    }
});

// Edit Route
app.get('/user/:id/edit', (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM users WHERE id = '${id}'`;

    connection.query(q, (err, results) => {
        if (err) throw err;
        let user = results[0];
        res.render("edit.ejs", { user });
    });
});

//update route

//update route
app.patch('/user/:id', (req, res) => {
    let { id } = req.params;
    let { username, password } = req.body;

    let q = `SELECT * FROM users WHERE id = '${id}'`;

    try {
        connection.query(q, (err, users) => {
            if (err) throw err;

            let user = users[0];

            if (password !== user.password) {
                return res.send("Wrong Password");
            }

            let q2 = `UPDATE users SET username = '${username}' WHERE id = '${id}'`;

            connection.query(q2, (err, result) => {
                if (err) throw err;

                res.redirect("/user");
            });
        });
    } catch (error) {
        console.error(error);
        res.send(`some error in the query`);
    }
});



app.listen('8080', () => {
    console.log('Server is running on port 8080');
});
