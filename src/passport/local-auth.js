const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//serealizar los datos 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserealizar los datos del usuario
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

//METODO PARA REGISTRARTE
passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    //es necesario realizar una validación para asegurarse de que no se repitan los usuarios

    //si encuentra un correo que concide, nos va a devolver un usuario "user"
    const user = await User.findOne({ email: email });

    if (user) {
        //flash se utiliza nombrando la variable
        return done(null, false, req.flash('signupMessage', 'The email is alredy taken'))
    } else {
        const newUser = new User()
        newUser.email = email;
        //Recibimos y encriptamos la contraseña
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    };

}));

//METODO PARA LOGEARSE

passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, email, password, done) => {
    //consulta a la base de datos
    const user = await User.findOne({ email: email });

    if (!user) {
        return done(null, false, req.flash('signinMessage', 'No user found.'))
    };
    if (!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Incorrect Password'))
    }
    done(null, user);
}))