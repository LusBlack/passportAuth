const express = require('express');
const router = express.Router();

////defines what happens when client makes a request

router.get('/login', (req, res) => res.send('Login'));


router.get('/register', (req, res) => res.send('Register'));

module.exports = router;
 