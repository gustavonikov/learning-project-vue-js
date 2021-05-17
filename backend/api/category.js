module.exports = server => {
    const { existsOrError, notExistsOrError } = server.api.validation

    const save = async (req, res) => {
        const category = { 
            id: req.body.id, 
            name: req.body.name, 
            parentId: req.body.parentId
        }

        if (req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'Name not informed')
        } catch(error) {
            return res.status(400).send(error)
        }

        if (category.id) {
            server.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        } else {
            server.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Category code was not informed.')

            const subcategory = await server.db('categories')
                .where({ parentId: req.params.id })

            notExistsOrError(subcategory, 'The selected category contains subcategories.')

            const articles = await server.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'The selected category contains articles.')

            const rowsDeleted = await server.db('categories')
                .where({ id: req.params.id }).del()
            
            existsOrError(rowsDeleted, 'The category was not found.')

            res.status(204).send()
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.find(parent => parent.id === parentId)

            return parent ? parent : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((category1, category2) => {
            if (category1.path < category2.path) return - 1

            if (category1.path > category2.path) return 1

            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        server.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(error => res.status(500).send(error))
    }

    const getById = (req, res) => {
        server.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(error => res.status(500).send(error))
    }

    const toTree = (categories, tree) => {
        if (!tree) tree = categories.filter(category => !category.parentId)

        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id

            parentNode.children = toTree(categories, categories.filter(isChild))

            return parentNode
        })

        return tree
    }

    const getTree = (req, res) => {
        server.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(error => res.status(500).send(error))
    }

    return { save, remove, get, getById, getTree }
}