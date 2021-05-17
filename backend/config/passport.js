const { authSecret } = require('../.env')
const passport = require('passport')
const jwtPassport = require('passport-jwt')
const { Strategy, ExtractJwt } = jwtPassport

module.exports = server => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        server.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } :  false))
            .catch(error => done(error, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}