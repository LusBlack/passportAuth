const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//user model
const User = require('../models/User');

////defines what happens when client makes a request

router.get('/login', (req, res) => res.render('login'));


router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    //destructure 
   const { name, email, password, password2 } = req.body;
   let errors = [];

   //check required fields
   if(!name || !email || !password ||!password2) {
    errors.push({ msg: 'Egbon fill in all fields' });
}

//check passwords match
if(password !== password2) {
    errors.push({ msg: 'Passwords do not match'});
}

//check pass length 
if(password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters'});
}

if(errors.length > 0) {
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2 
    });

} else {
    //validation passed

    //check if user already exists
    User.findOne({ email: email })
    .then(user => {
        if(User) {
            //user exists
            errors.push({ msg: 'Email is already registered' });
            res.render('register', {
                errors,
                name,
                email,
                password
            });

        } 
        else {
            const newUser = new User({
                name,
                email,
                password
            });

            //Hash passcode
            bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                //set password to hashed

                newUser.password = hash;
                //save user
                newUser.save()
                .then(user => {
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
            }))

        //     // console.log(newUser)
        //     // res.send('hello');


        }

    })




}

});


// router.post('/login', (req, res) => {

// })

module.exports = router;
 