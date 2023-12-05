const {Client} = require('pg')
const express = require("express");
const router = express.Router();
// const db = require("../services/db");
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "root",
    database: "NodeAppTest"
})
client.connect();

// Get all posts
router.get("/", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM posts ORDER BY postid ASC");
        if (DEBUG) {
            console.log(result.rows);
        }
        res.render("posts", { posts: result.rows });
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Display the form for creating a new post
router.get("/new", (req, res) => {
    res.render("newPost");
});

// Create a new post
router.post("/", async (req, res) => {
    const { title, content } = req.body;
    try {
        if (!title || !content) {
            return res.status(400).send("Title and content are required.");
        }
        if (DEBUG) {
            console.log("Creating post with title: ", title);
        }
        const result = await client.query(
            "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
            [title, content]
        );
        res.redirect("/posts");
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Display the form for updating a post
router.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Post ID is required.");
        }
        if (DEBUG) {
            console.log("Editing post with id: ", id);
        }
        const result = await client.query("SELECT * FROM posts WHERE postid = $1", [id]);
        if (DEBUG) {
            console.log(result.rows[0]);
        }
        if (!result.rows[0]) {
            return res.status(404).send("Post not found.");
        }
        res.render("postEdit", { post: result.rows[0] });
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Update a post
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        if (!id) {
            return res.status(400).send("Post ID is required.");
        }
        if (!title || !content) {
            return res.status(400).send("Title and content are required.");
        }
        const result = await client.query(
            "UPDATE posts SET title = $1, content = $2 WHERE postid = $3 RETURNING *",
            [title, content, id]
        );
        if (DEBUG) {
            console.log("Updating post with id: ", id);
        }
        if (!result.rows[0]) {
            return res.status(404).send("Post not found.");
        }
        res.redirect("/posts");
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Display the form for deleting a post
router.get("/:id/delete", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Post ID is required.");
        }
        if (DEBUG) {
            console.log("Deleting post with id: ", id);
        }
        const result = await client.query("SELECT * FROM posts WHERE postid = $1", [id]);
        if (!result.rows[0]) {
            return res.status(404).send("Post not found.");
        }
        res.render("postDelete", { post: result.rows[0] });
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a post
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Post ID is required.");
        }
        const result = await client.query("DELETE FROM posts WHERE postid = $1 RETURNING *", [id]);
        if (!result.rows[0]) {
            return res.status(404).send("Post not found.");
        }
        res.redirect("/posts");
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
