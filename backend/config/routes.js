const admin = require('./admin')

module.exports = server => {
    server.post('/signup', server.api.users.save)
    server.post('/signIn', server.api.auth.signIn)
    server.post('/validateToken', server.api.auth.validateToken)

    server.route('/users')
        .all(server.config.passport.authenticate())
        .post(admin(server.api.users.save))
        .get(admin(server.api.users.get))
        .delete(admin(server.api.users.remove))

    server.route('/users/:id')
        .all(server.config.passport.authenticate())
        .put(admin(server.api.users.save))
        .get(admin(server.api.users.getById))

    server.route('/categories')
        .all(server.config.passport.authenticate())
        .get(admin(server.api.category.get))
        .post(admin(server.api.category.save))

    server.route('/categories/tree')
        .all(server.config.passport.authenticate())
        .get(server.api.category.getTree)

    server.route('/categories/:id')
        .all(server.config.passport.authenticate())
        .get(server.api.category.getById)
        .put(admin(server.api.category.save))
        .delete(admin(server.api.category.remove))

    server.route('/articles')
        .all(server.config.passport.authenticate())
        .get(admin(server.api.article.get))
        .post(admin(server.api.article.save))

    server.route('/articles/:id')
        .all(server.config.passport.authenticate())
        .get(server.api.article.getById)
        .put(admin(server.api.article.save))
        .delete(admin(server.api.article.remove))

    server.route('/categories/:id/articles')
        .all(server.config.passport.authenticate())
        .get(server.api.article.getByCategory)

    server.route('/stats')
        .all(server.config.passport.authenticate())
        .get(server.api.stat.get)
}