const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;
require('dotenv').config();

// Serve static files from the 'public' directory
app.use(express.static('public'));

global.DEBUG = true;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, }));
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

// 404 page
app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Simple app running on port ${PORT}.`)
});