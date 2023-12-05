CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE comments (
    commentid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid),
    postid INT REFERENCES posts(postid),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
