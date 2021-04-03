const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//initializations
const app = express();
//requieres el archivo donde construimos la base de datos en el archivo principal
require('./database');
require('./passport/local-auth');

//setings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);


//middlewares


//app.use(morgan('dev')) nota: nos muestra en consola las consultas de la página
app.use(morgan('dev'));
// app.use(express.urlencoded({ extend: false })) nota: nos permite poder recibir 
//los datos desde el cliente. Se le dá una configuración, en este caso 'false'
//la cual me dice que no va a recibir archivos pesados como imagenes.
app.use(express.urlencoded({ extend: false }));
//configurando express-session y así guardar en sesión los datos:
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
//para inicializar passport
app.use(passport.initialize());
//para guardar los datos del usuario en un archivo web
app.use(passport.session());


app.use((req, res, next) => {
    //se crea una variable para toda la app ''app.local''
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    //se utiliza next para, luego de guardar el valor de la variable que nos debe devolver
    //en ''signupMessage'', la aplicación continue con los siguientes procesos y no se estanque
    next();
});


//routes
app.use('/', require('./routes/index'));


//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});