const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig)

knex.migrate.latest([knexConfig])

module.exports = knex