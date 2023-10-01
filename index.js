const express = require('express');
const port = 8000;
const app = express();
const cookieParser = require('cookie-parser'); // install cookie-parser for cookies
const expressLayout = require('express-ejs-layouts');
const db = require('./config/mongoose'); // import db
//install passport and session
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const flashMW = require('./config/flashMiddleware');

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayout);

// extract css and js files from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// setting up a view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookies in the db
app.use(session({
    name: 'codeial',
    //TODO change secretbefore deployment 
    secret: 'blahblahcarblahblahcar',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development',
            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize()); //initialize passport and tell the app to use it
app.use(passport.session()); //tell the app to use passport for creating a session 
app.use(passport.setAuthenticatedUser);
app.use(flash()); //flash messages
app.use(flashMW.setFlash)

// home page routes
app.use('/', require('./routes'));


app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server ${err}`);
    }
    console.log(`Server is running on port http://localhost:${port}`);
})