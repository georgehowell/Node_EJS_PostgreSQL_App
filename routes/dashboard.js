// Import required modules
const express = require('express');
const router = express.Router();
const db = require('../services/db');



router.get('/get/dashboard', async (req, res) => {
    console.log("this is the Dashboard Page for Registered User")
});

module.exports = router;
