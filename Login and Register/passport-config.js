const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByName, getUserById) {
    const authenticateUser = async (name, password, done) => {
        const user = await getUserByName(name)
        if (user == null) {
            return done(null, false, { message: 'Nincs ilyen felhasználó ilyen névvel. '})
        }

        try {
            debugger
            if (await bcrypt.compare(password, user.pwd)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Helytelen jelszó!'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'name'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    })
}

module.exports = initialize