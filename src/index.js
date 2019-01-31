//manejar rutas
const path = require('path');
//odm para mongoDB
const mongoose = require('mongoose');
//autenticacion de usuarios
var passport = require('passport');
//guardar mensajes por sesiones
const flash = require('connect-flash');
//administar peticiones
const morgan = require('morgan');
//manejar cookies
const cookieParser = require('cookie-parser');
//procesar informacion de entrada
const bodyParser = require('body-parser');
//mantener la sesion con la informacion de usuario sin necesidad de consultar siempre a la base de datos
const session = require('express-session');

const exphbs = require('express-handlebars');
const express = require('express');
const app = express();

const { URL } = require('./config/database');

mongoose.connect(URL, {
    useNewUrlParser: true
});
require('./config/passport')(passport);
//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
}));
//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'login',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//routes
require('./app/routes')(app, passport);
//static files
app.use(express.static(path.join(__dirname, 'public')))


app.listen(app.get('port'), () => {
    console.log('Servidor activo en el puerto: ', app.get('port'));
});