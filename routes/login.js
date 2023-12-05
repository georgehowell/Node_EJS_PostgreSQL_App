// Import required modules
const express = require('express');
const router = express.Router();
const db = require('../services/db');



router.get('/get/login', async (req, res) => {
    console.log("this is the Login Page")
});

module.exports = router;
