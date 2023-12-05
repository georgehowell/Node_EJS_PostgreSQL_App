// routes/users.js

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

// Get all users
router.get("/", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM users ORDER BY userid ASC");
        if (DEBUG) {
            // console.log(result.rows);
        }
        res.render("users", { users: result.rows });
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Display the form for creating a new user
router.get("/new", (req, res) => {
    res.render("newUser");
});

// Create a new user
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).send("Username, email, and password are required.");
        }
        if (DEBUG) {
            console.log("Creating user with username: ", username);
        }
        const result = await client.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, password]
        );
        res.redirect("/users");
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Display the form for updating a user
router.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("User ID is required.");
        }
        if (DEBUG) {
            console.log("Editing user with id: ", id);
        }
        const result = await client.query("SELECT * FROM users WHERE userid = $1", [id]);
        if (!result.rows[0]) {
            return res.status(404).send("User not found.");
        }
        res.render("userEdit", { user: result.rows[0] });
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Update a user
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        if (!id) {
            return res.status(400).send("User ID is required.");
        }
        if (!username || !email || !password) {
            return res.status(400).send("Username, email, and password are required.");
        }
        if (DEBUG) {
            console.log("Updating user with id: ", id);
        }
        const result = await client.query(
            "UPDATE users SET username = $1, email = $2, password = $3 WHERE userid = $4 RETURNING *",
            [username, email, password, id]
        );
        if (!result.rows[0]) {
            return res.status(404).send("User not found.");
        }
        res.redirect("/users");
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Display the form for deleting a user
router.get("/:id/delete", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("User ID is required.");
        }
        if (DEBUG) {
            console.log("Deleting user with id: ", id);
        }
        const result = await client.query("SELECT * FROM users WHERE userid = $1", [id]);
        if (!result.rows[0]) {
            return res.status(404).send("User not found.");
        }
        res.render("userDelete", { user: result.rows[0] });
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a user
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("User ID is required.");
        }
        const result = await client.query(
            "DELETE FROM users WHERE userid = $1 RETURNING *",
            [id]
        );
        if (!result.rows[0]) {
            return res.status(404).send("User not found.");
        }
        res.redirect("/users");
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
