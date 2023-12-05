-- Update statements for users/users api route
UPDATE users SET username = $1, email = $2, password = $3 WHERE userid = $4 RETURNING *

-- Update statements for posts/posts api route
UPDATE posts SET title = $1, content = $2 WHERE postid = $3 RETURNING *

-- Update statements for comments/comments api route
UPDATE comments SET content = $1 WHERE commentID = $2 RETURNING *