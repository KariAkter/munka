if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express =  require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const {getUserByName, getUserById, addUser, getLeaderboard,addToLeaderboard} = require('./dbHandler')

const initializePassport = require('./passport-config')
const { func } = require('joi')
initializePassport(
    passport,
    async (name) => {
        const user = await getUserByName(name)
        return user
    },
    async (id) => {
        const user = await getUserById(id)
        return user
    }
)
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.set('view-engine', 'ejs')

app.get('/', checkAuthenticated, (req, res) => {
    console.log(req.user.username);
    res.render('Fooldal.ejs', {name: req.user.username})
})

app.get('/login', checkNotAuthenticated, (req, res) =>{
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) =>{
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await addUser(req.body.name, req.body.email, hashedPassword)
        res.redirect('/login')
    } catch {   
        res.redirect('/register')
    }
})

app.post('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.get('/Fooldal', (req, res) => {
    res.render('Fooldal.ejs', { name: 'Felhasználó!' });
})

app.get('/Letoltes', (req, res) => {
    res.render('Letoltes.ejs')
})

app.get('/Eredmeny', (req, res) => {
    res.render('Eredmeny.ejs')
})

app.get('/Rolunk', (req,res) => {
    res.render('Rolunk.ejs')
})

app.get('/Adat/Leaderboard', async (req, res) =>{
    const leaderboard = await getLeaderboard()
    res.send(JSON.stringify(leaderboard))
})
/*
async function test()
{
    await addToLeaderboard(6, 2200)
}
test()
*/
app.listen(5000, () => console.log("http://localhost:5000"))