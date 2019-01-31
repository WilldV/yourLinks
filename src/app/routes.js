const Link = require('../app/models/link');
module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        res.render('index');
    })
    app.get('/login', (req, res) => {        
        res.render('login', {
            message: req.flash('error'),
        });
    })
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile',    
            failureRedirect: '/login',
            failureFlash: true
        })
    )
    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('error')
        });
    })
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    app.get('/profile', isLogged, async (req, res) => {
        const id = req.user._id;
        res.redirect(`profile/${id}`);
    })
    app.get('/profile/:id', async (req,res) =>{
        const idUsuario =  req.params.id;
        const links = await Link.find({idUsuario});
        res.render('profile',{links, idUsuario});
    })
    app.get('/profile/:id/agregar', (req,res) =>{
        res.render('agregarLink',{id: req.params.id});  
    })
    app.post('/profile/:id/agregar', async (req,res) =>{
        const idUsuario = req.params.id;
        const nuevoLink = new Link({
            idUsuario: idUsuario,
            nombre: req.body.nombre,
            direccion: req.body.direccion
        })
        await nuevoLink.save();
        res.redirect(`/profile/${idUsuario}`);
    })
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
    function isLogged(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/');
        }
    }

};