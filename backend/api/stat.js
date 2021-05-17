module.exports = server => {
    const Stat = server.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt': -1 }})
            .then(stat => {
                const defaultValues = {
                    users: 0, 
                    categories: 0, 
                    articles : 0 
                }

                return res.json(stat || defaultValues)
            })
    }

    return { Stat, get }
}