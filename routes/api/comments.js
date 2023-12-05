// Import required modules
const express = require('express');
const router = express.Router();
const db = require('../../services/db');

// Define the API endpoint to get all comments
router.get('/get/comments', async (req, res) => {
    try {
        // Retrieve comments from the database
        const result = await db.query('SELECT * FROM comments ORDER BY commentid ASC');

        // Send the comment data as JSON
        res.json({ comments: result.rows });
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define the API endpoint to get a specific comment by ID
router.get('/get/comment/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM comments WHERE commentid = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            res.json({ comment: result.rows[0] });
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a specific comment by ID
router.get('/delete/comment/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM comments WHERE commentid = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            if (DEBUG) {
                console.log("Successfully deleted comment with id: " + id + " from the database.");
            }
            res.json({ message: 'Comment deleted successfully', deletedComment: result.rows[0] });
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error. Comment ' + id + ' is still referenced in another table.' });
    }
});

// Export the router
module.exports = router;
