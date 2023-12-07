const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;
require('dotenv').config();


// User Login / User Register:
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const {Client} = require('pg')


// Serve static files from the 'public' directory
app.use(express.static('public'));

global.DEBUG = true;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false, }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/about', (request, response) => {
    response.render('about.ejs');
});



// routes
const postsRouter = require('./routes/posts')
app.use('/posts', postsRouter);

const commentsRouter = require('./routes/comments')
app.use('/comments', commentsRouter);

const usersRouter = require('./routes/users')
app.use('/users', usersRouter);

// api routes
const apiusersRouter = require('./routes/api/users');
app.use('/api', apiusersRouter);

const apicommentsRouter = require('./routes/api/comments');
app.use('/api', apicommentsRouter);

const apipostsRouter = require('./routes/api/posts');
app.use('/api', apipostsRouter);


// Login / Register routes
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const dashboardRouter = require('./routes/dashboard');
app.use('/users/dashboard', dashboardRouter);






/* * * * * * * * * * * * * * * * * * * * */
/*     User Login / User Registration    */
/* * * * * * * * * * * * * * * * * * * * */
const initializePassport = require("./passportConfig");

initializePassport(passport);

// Middleware
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "NodeAppTest"
})
client.connect();

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());





app.get("/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log(req.session.flash.error);
  res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  // res.render("dashboard", { user: req.user.username });
  res.render("dashboard", { username: req.username });
});

app.post("/users/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/')
  });
  // res.render("index", { message: "You have logged out successfully" });
});

app.post("/register", async (req, res) => {
  let { username, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    username,
    email,
    password,
    password2
  });

  if (!username || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register.ejs", { errors, username, email, password, password2 });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    client.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(err);

        console.log(results.rows);

        if (results.rows.length > 0) {
          errors.push({ message: "email already registered" })
          return res.render("register.ejs", { errors });
        } else {
          client.query(
            `INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING userid, password`,
            [username, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// 404 page
app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Simple app running on port ${PORT}.`)
});
