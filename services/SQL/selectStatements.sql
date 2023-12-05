-- Select statements for users/users api route
SELECT * FROM users
SELECT * FROM users WHERE userid = $1

-- Select statements for posts/posts api route
SELECT * FROM posts
SELECT * FROM posts WHERE postid = $1

-- Select statements for comments/comments api route
SELECT * FROM comments
SELECT * FROM comments WHERE commentID = $1