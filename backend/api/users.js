const bcrypt = require('bcrypt-nodejs')

module.exports = server => {
    const { existsOrError, notExistsOrError, equalsOrError } = server.api.validation

    const encryptPassword = password => {
        const salt  = bcrypt.genSaltSync(10)

        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }

        if (req.params.id) user.id = req.params.id

        if (!req.originalUrl.startsWith('/users')) user.admin = false
        if (!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Name not informed')
            existsOrError(user.email, 'E-mail not informed')
            existsOrError(user.password, 'Password not informed')
            existsOrError(user.confirmPassword, 'Invalid password confirmation')
            equalsOrError(user.password, user.confirmPassword, 'Passwords do not match')
        
            const userFromDB = await server.db('users')
                .where({ email: user.email }).first()
            
            if (!user.id) notExistsOrError(userFromDB, 'User already exists')
        } catch(error) {
            return res.status(400).send(error)
        }

        user.password = encryptPassword(req.body.password)

        delete user.confirmPassword

        if (user.id) {
            server.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        } else {
            server.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        }
    }

    const get = (req, res) => {
        server.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(error => res.status(500).send(error))
    }

    const getById = (req, res) => {
        server.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(error => res.status(500).send(error))
    }

    const remove = async (req, res) => {
        try {
            const articles = await server.db('articles')
                .where({ userId: req.params.id })

            notExistsOrError(articles, 'The user possess articles.')

            const rowsUpdated = await server.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })
            
            existsOrError(rowsUpdated, 'User not found.')

            res.status(204).send()
        } catch(error) {
            res.status(400).send(error)
        }
    }

    return { save, get, getById, remove }
}