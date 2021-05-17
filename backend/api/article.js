const queries = require('./queries')

module.exports = server => {
    const { existsOrError } = server.api.validation

    const save = async (req, res) => {
        const article = { ...req.body }

        if (req.params.id) article.id = req.params.id

        try {
            existsOrError(article.name, 'Name not informed')
            existsOrError(article.description, 'Description not informed')
            existsOrError(article.categoryId, 'Category not informed')
            existsOrError(article.userId, 'Author not informed')
            existsOrError(article.content, 'Content not added')
        } catch(error) {
            return res.status(400).send(error)
        }

        if (article.id) {
            server.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        } else {
            server.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await server.db('articles')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'The article was not found.')
            } catch(error) {
                return res.status(400).send(error)
            }

            res.status(204).send()
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const limit = 10

    const get = async (req, res) => {
        const page = req.query.page || 1
        const result = await server.db('articles').count('id').first()
        const count = parseInt(result.count)

        server.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(error => res.status(500).send(error))

    }

    const getById = (req, res) => {
        server.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(error => res.send(500).send(error))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await server.db.raw(queries.categoryWithChild, categoryId)
        const ids = categories.rows.map(category => category.id)

        server.db({ a: 'articles', u: 'users' })
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(error => res.status(500).send(error))
    }

    return { save, remove, get, getById, getByCategory }
}