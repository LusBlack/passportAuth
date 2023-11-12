//we import the express framework 
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
//const passport = require('./config/passport');
const passport = require('passport')


//passport config 
require('./config/passport')(passport)

const app = express();

//DB config. We use the mongo key stored with the vaiable MongoURI
//in the keys.js file under the config folder
const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true,
                       useUnifiedTopology: true,})
   .then(() => console.log('MongoDB connected...'))
   .catch(err => console.log(err));
console.log("brick");

//EJS middleware
//to handle layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser 
//to handle and process data sent from client-side forms 
app.use(express.urlencoded({ extended: false }));

//express session
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash()); 

//global vars
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));