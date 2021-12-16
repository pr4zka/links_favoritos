const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const { patch } = require('./routes/index');
const flash = require('connect-flash');
const session = require('express-session');
const MYSQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');



//INICIALIZACION

const app = express();
require('./lib/passport');

//SETTINGS

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');


//MIDLEWARESS

app.use(session({
    secret: 'pr4zka',
    resave: false,
    saveUninitialized: false,
    store: new MYSQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//GLOBAL VARIABLES
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/authentications'));
app.use('/links', require('./routes/links'));
//PUBLIC 
app.use(express.static(path.join(__dirname, 'public')));

//STARTING THE SERVER

app.listen(app.get('port'), () => {

    console.log('server on port', app.get('port'));

})
