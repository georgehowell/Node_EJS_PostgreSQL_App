// Import required modules
const express = require('express');
const router = express.Router();
const db = require('../../services/db');

// Define the API endpoint to get all posts
router.get('/get/posts', async (req, res) => {
    try {
        // Retrieve posts from the database
        const result = await db.query('SELECT * FROM posts ORDER BY postid ASC');

        // Send the post data as JSON
        res.json({ posts: result.rows });
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define the API endpoint to get a specific post by ID
router.get('/get/post/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM posts WHERE postid = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json({ post: result.rows[0] });
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a specific post by ID
router.get('/delete/post/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM posts WHERE postid = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            if (DEBUG) {
                console.log("Successfully deleted post with id: " + id + " from the database.");
            }
            res.json({ message: 'Post deleted successfully', deletedPost: result.rows[0] });
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error. Post ' + id + ' is still referenced in another table.' });
    }
});

// Export the router
module.exports = router;
