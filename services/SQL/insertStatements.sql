-- Insert statements for users/users api route
INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *

-- Insert statements for posts/posts api route
INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *

-- Insert statements for comments/comments api route
INSERT INTO comments (content) VALUES ($1) RETURNING *