// Import required modules
const express = require('express');
const router = express.Router();
const db = require('../services/db');



router.get('/get/regiser', async (req, res) => {
    console.log("this is the Register Page")
});

module.exports = router;