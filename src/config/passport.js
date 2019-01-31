const local = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //metodo para registrar
    passport.use('local-signup', new local({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallBack: true
    },
        function (email, password, done) {
            console.log(done);
            
            User.findOne({ 'local.email': email }, function (err, user) {
                if (err) { return done(err); }
                if (user) {
                    return done(null, false, {message: 'El correo ya ha sido registrado anteriormente.' });
                } else {
                    newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function (err) {
                        if (err) { throw err; }
                        return done(null, newUser);
                    })
                }
            })
        }
    ))
    //login
    passport.use('local-login', new local({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallBack: true
    },
        function (email, password, done) {
            User.findOne({ 'local.email': email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, {message: 'El correo no existe...'})
                } 
                if(!user.validatePassword(password)){
                    return done(null, false, {message: 'Contraseña incorrecta...'})
                }
                return done(null, user);
            })
        }
    ))
};