-- Delete statements for users/users api route
DELETE FROM users WHERE userid = $1 RETURNING *

-- Delete statements for posts/posts api route
DELETE FROM posts WHERE postid = $1 RETURNING *

-- Delete statements for comments/comments api route
DELETE FROM comments WHERE commentid = $1 RETURNING *